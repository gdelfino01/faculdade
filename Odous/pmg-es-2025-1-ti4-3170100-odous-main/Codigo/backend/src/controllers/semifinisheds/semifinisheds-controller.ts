import express from 'express';
import { Op } from 'sequelize';

import Semifinished from '../../models/semifinished';
import Material from '../../models/material';
import SemifinishedMaterial from '../../models/semifinished-material';
import SemifinishedFamily from '../../models/semifinished-family';

import {
    GetSemifinishedParamsDTO,
    GetSemifinishedsParamsDTO,
    PostSemifinishedBodyDTO,
    UpdateSemifinishedBodyDTO,
    SemifinishedResponseDTO
} from './dtos';

const configIncludeRequiredMaterials = (
    includeRequiredMaterials: GetSemifinishedParamsDTO['includeRequiredMaterials']
): Record<string, unknown>[] | undefined => {
    const semifinishedFamily = {
        model: SemifinishedFamily,
        as: 'family'
    };

    return includeRequiredMaterials === 'NO' ? [semifinishedFamily] : [{
        model: Material,
        as: 'requiredMaterials',
        attributes: includeRequiredMaterials === 'SHORT' ? ['id'] : undefined,
        through: { attributes: ['requiredQuantity'] }
    },
    semifinishedFamily];
};

const toSemifinishedDTO = (
    entity: Semifinished,
    mode: GetSemifinishedParamsDTO['includeRequiredMaterials']
): SemifinishedResponseDTO => {
    const { familyId, ...semifinished } = entity.get({ plain: true });

    const requiredMaterials = mode === 'NO' ? undefined : semifinished.requiredMaterials.map(material => {
        const requiredQuantity = material.SemifinishedMaterial?.requiredQuantity;

        const { SemifinishedMaterial, ...restMaterial } = material;
        const materialDTO = restMaterial;

        return mode === 'SHORT'
            ? { materialId: materialDTO.id, requiredQuantity }
            : { material: materialDTO, requiredQuantity };
    });

    return {
        ...semifinished,
        requiredMaterials
    };
};

// Get semifinished by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { includeRequiredMaterials = 'SHORT' } = req.query as GetSemifinishedParamsDTO;

        const semifinished = await Semifinished.findByPk(id, {
            include: configIncludeRequiredMaterials(includeRequiredMaterials)
        });

        if (semifinished) res.status(200).send(toSemifinishedDTO(semifinished, includeRequiredMaterials) as SemifinishedResponseDTO);
        else res.status(404).send('Semifinished not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Get semifinished by SKU
export const getBySKU = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const sku = req.params.sku;
        const { includeRequiredMaterials = 'SHORT' } = req.query as GetSemifinishedParamsDTO;

        const semifinished = await Semifinished.findOne({
            where: { sku },
            include: configIncludeRequiredMaterials(includeRequiredMaterials)
        });

        if (semifinished) res.status(200).send(toSemifinishedDTO(semifinished, includeRequiredMaterials) as SemifinishedResponseDTO);
        else res.status(404).send('Semifinished not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Get semifinisheds
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetSemifinishedsParamsDTO;
        const {
            search,
            createdAfterDate,
            createdBeforeDate,
            includeRequiredMaterials = 'SHORT',
            familyId
        } = reqParams;

        const semifinisheds = await Semifinished.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { sku: { [Op.like]: `%${search}%` } },
                        { name: { [Op.like]: `%${search}%` } },
                    ]
                }),
                ...(createdAfterDate && {
                    createdAt: { [Op.gte]: new Date(createdAfterDate) }
                }),
                ...(createdBeforeDate && {
                    createdAt: { [Op.lte]: new Date(createdBeforeDate) }
                }),
                ...(familyId && { familyId })
            },
            include: configIncludeRequiredMaterials(includeRequiredMaterials)
        });

        res.status(200).send(semifinisheds.map(semifinished => toSemifinishedDTO(semifinished, includeRequiredMaterials)) as SemifinishedResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// POST /semifinisheds
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostSemifinishedBodyDTO;
        const { requiredMaterials, ...semifinishedData } = reqBody;

        const semifinished = await Semifinished.create(semifinishedData);

        if (requiredMaterials?.length) {
            if (new Set(requiredMaterials.map(rm => rm.materialId)).size !== requiredMaterials.length) {
                res.status(400).send('Duplicate material IDs amongst informed required materials');
                return;
            }

            const bulkRows = requiredMaterials.map(requiredMaterial => ({
                semifinishedId: semifinished.id,
                materialId: requiredMaterial.materialId,
                requiredQuantity: requiredMaterial.requiredQuantity
            }));

            await SemifinishedMaterial.bulkCreate(bulkRows);
        }

        const createdSemifinished = await Semifinished.findByPk(semifinished.id, {
            include: configIncludeRequiredMaterials("SHORT")
        });
        if (createdSemifinished) res.status(200).send(toSemifinishedDTO(createdSemifinished, 'SHORT') as SemifinishedResponseDTO);
        else res.status(404).send('Created semifinished not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// PUT /semifinisheds/:id
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateSemifinishedBodyDTO;
        const { requiredMaterials, ...updateData } = reqBody;

        let semifinished = await Semifinished.findByPk(id);

        if (semifinished) {
            semifinished = await semifinished.update(updateData);

            if (requiredMaterials?.length) {
                if (new Set(requiredMaterials.map(rm => rm.materialId)).size !== requiredMaterials.length) {
                    res.status(400).send('Duplicate material IDs amongst informed required materials');
                    return;
                }

                await SemifinishedMaterial.destroy({ where: { semifinishedId: id } });

                const bulkRows = requiredMaterials.map(requiredMaterial => ({
                    semifinishedId: Number(id),
                    materialId: requiredMaterial.materialId,
                    requiredQuantity: requiredMaterial.requiredQuantity
                }));

                await SemifinishedMaterial.bulkCreate(bulkRows);
            }

            const updatedSemifinished = await Semifinished.findByPk(semifinished.id, {
                include: configIncludeRequiredMaterials("SHORT")
            });
            if (updatedSemifinished) res.status(200).send(toSemifinishedDTO(updatedSemifinished, 'SHORT') as SemifinishedResponseDTO);
            else res.status(404).send('Updated semifinished not found!');
        } else res.status(404).send('Semifinished not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete semifinished
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search semifinished by id
        const semifinished = await Semifinished.findByPk(id);
        if (semifinished) {
            await semifinished.destroy();

            res.status(200).send(`Semifinished with id ${id} deleted successfully!`);
        } else res.status(404).send('Semifinished not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}