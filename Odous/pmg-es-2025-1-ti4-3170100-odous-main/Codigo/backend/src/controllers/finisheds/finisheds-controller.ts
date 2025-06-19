import express from 'express';
import { Op } from 'sequelize';

import Finished from '../../models/finished';
import Material from '../../models/material';
import FinishedMaterial from '../../models/finished-material';
import Semifinished from '../../models/semifinished';
import FinishedSemifinished from '../../models/finished-semifinished';
import AnvisaRegister from '../../models/anvisa-register';

import {
    GetFinishedParamsDTO,
    GetFinishedsParamsDTO,
    PostFinishedBodyDTO,
    UpdateFinishedBodyDTO,
    FinishedResponseDTO
} from './dtos';

const configIncludeRequireds = (
    includeRequiredMaterials: GetFinishedParamsDTO['includeRequiredMaterials'],
    includeRequiredSemifinisheds: GetFinishedParamsDTO['includeRequiredSemifinisheds']
): Record<string, unknown>[] | undefined => {
    const anvisaRegister = {
        model: AnvisaRegister,
        as: 'anvisaRegister'
    };

    const material = includeRequiredMaterials === 'NO' ? [] : [{
        model: Material,
        as: 'requiredMaterials',
        attributes: includeRequiredMaterials === 'SHORT' ? ['id'] : undefined,
        through: { attributes: ['requiredQuantity'] }
    }];

    const semifinished = includeRequiredSemifinisheds === 'NO' ? [] : [{
        model: Semifinished,
        as: 'requiredSemifinisheds',
        attributes: includeRequiredSemifinisheds === 'SHORT' ? ['id'] : undefined,
        through: { attributes: ['requiredQuantity'] }
    }];

    return [...material, ...semifinished, anvisaRegister];
};

const toFinishedDTO = (
    entity: Finished,
    materialMode: GetFinishedParamsDTO['includeRequiredMaterials'],
    semifinishedMode: GetFinishedParamsDTO['includeRequiredSemifinisheds']
): FinishedResponseDTO => {
    const { anvisaRegister, ...finished } = entity.get({ plain: true });

    const requiredMaterials = materialMode === 'NO' ? undefined : finished.requiredMaterials.map(material => {
        const requiredQuantity = material.FinishedMaterial?.requiredQuantity;

        const { FinishedMaterial, ...restMaterial } = material;
        const materialDTO = restMaterial;

        return materialMode === 'SHORT'
            ? { materialId: materialDTO.id, requiredQuantity }
            : { material: materialDTO, requiredQuantity };
    });

    const requiredSemifinisheds = semifinishedMode === 'NO' ? undefined : finished.requiredSemifinisheds.map(semifinished => {
        const requiredQuantity = semifinished.FinishedSemifinished?.requiredQuantity;

        const { FinishedSemifinished, requiredMaterials, ...restSemifinished } = semifinished;
        const semifinishedDTO = restSemifinished;

        return semifinishedMode === 'SHORT'
            ? { semifinishedId: semifinishedDTO.id, requiredQuantity }
            : { semifinished: semifinishedDTO, requiredQuantity };
    });

    return {
        ...finished,
        requiredMaterials,
        requiredSemifinisheds
    };
};

// Get finished by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            includeRequiredMaterials = 'SHORT',
            includeRequiredSemifinisheds = 'SHORT'
        } = req.query as GetFinishedParamsDTO;

        const finished = await Finished.findByPk(id, {
            include: configIncludeRequireds(includeRequiredMaterials, includeRequiredSemifinisheds)
        });

        if (finished) res.status(200).send(toFinishedDTO(finished, includeRequiredMaterials, includeRequiredSemifinisheds) as FinishedResponseDTO);
        else res.status(404).send('Finished not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Get finished by SKU
export const getBySKU = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const sku = req.params.sku;
        const {
            includeRequiredMaterials = 'SHORT',
            includeRequiredSemifinisheds = 'SHORT'
        } = req.query as GetFinishedParamsDTO;

        const finished = await Finished.findOne({
            where: { sku },
            include: configIncludeRequireds(includeRequiredMaterials, includeRequiredSemifinisheds)
        });

        if (finished) res.status(200).send(toFinishedDTO(finished, includeRequiredMaterials, includeRequiredSemifinisheds) as FinishedResponseDTO);
        else res.status(404).send('Finished not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Get finisheds
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetFinishedsParamsDTO;
        const {
            search,
            createdAfterDate,
            createdBeforeDate,
            includeRequiredMaterials = 'SHORT',
            includeRequiredSemifinisheds = 'SHORT',
            rawMaterialId
        } = reqParams;

        const finisheds = await Finished.findAll({
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
                ...(rawMaterialId && {
                    '$anvisaRegister.rawMaterialId$': rawMaterialId
                })
            },
            include: configIncludeRequireds(includeRequiredMaterials, includeRequiredSemifinisheds)
        });

        res.status(200).send(finisheds.map(finished => toFinishedDTO(finished, includeRequiredMaterials, includeRequiredSemifinisheds)) as FinishedResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// POST /finisheds
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostFinishedBodyDTO;
        const { requiredMaterials, requiredSemifinisheds, ...finishedData } = reqBody;

        const finished = await Finished.create(finishedData);

        if (requiredMaterials?.length) {
            if (new Set(requiredMaterials.map(rm => rm.materialId)).size !== requiredMaterials.length) {
                res.status(400).send('Duplicate material IDs amongst informed required materials');
                return;
            }

            const bulkRows = requiredMaterials.map(requiredMaterial => ({
                finishedId: finished.id,
                materialId: requiredMaterial.materialId,
                requiredQuantity: requiredMaterial.requiredQuantity
            }));

            await FinishedMaterial.bulkCreate(bulkRows);
        }

        if (requiredSemifinisheds?.length) {
            if (new Set(requiredSemifinisheds.map(rs => rs.semifinishedId)).size !== requiredSemifinisheds.length) {
                res.status(400).send('Duplicate semifinished IDs amongst informed required semifinisheds');
                return;
            }

            const bulkRows = requiredSemifinisheds.map(rs => ({
                finishedId: finished.id,
                semifinishedId: rs.semifinishedId,
                requiredQuantity: rs.requiredQuantity,
            }));

            await FinishedSemifinished.bulkCreate(bulkRows);
        }

        const createdFinished = await Finished.findByPk(finished.id, {
            include: configIncludeRequireds("SHORT", "SHORT")
        });
        if (createdFinished) res.status(200).send(toFinishedDTO(createdFinished, "SHORT", "SHORT") as FinishedResponseDTO);
        else res.status(404).send('Created finished not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Finished with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// PUT /finisheds/:id
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateFinishedBodyDTO;
        const { requiredMaterials, requiredSemifinisheds, ...updateData } = reqBody;

        let finished = await Finished.findByPk(id);

        if (finished) {
            finished = await finished.update(updateData);

            if (requiredMaterials?.length) {
                if (new Set(requiredMaterials.map(rm => rm.materialId)).size !== requiredMaterials.length) {
                    res.status(400).send('Duplicate material IDs amongst informed required materials');
                    return;
                }

                await FinishedMaterial.destroy({ where: { finishedId: id } });

                const bulkRows = requiredMaterials.map(requiredMaterial => ({
                    finishedId: Number(id),
                    materialId: requiredMaterial.materialId,
                    requiredQuantity: requiredMaterial.requiredQuantity
                }));

                await FinishedMaterial.bulkCreate(bulkRows);
            }

            if (requiredSemifinisheds?.length) {
                if (new Set(requiredSemifinisheds.map(rs => rs.semifinishedId)).size !== requiredSemifinisheds.length) {
                    res.status(400).send('Duplicate semifinished IDs amongst informed required semifinisheds');
                    return;
                }

                await FinishedSemifinished.destroy({ where: { finishedId: id } });

                const bulkRows = requiredSemifinisheds.map(requiredSemifinished => ({
                    finishedId: Number(id),
                    semifinishedId: requiredSemifinished.semifinishedId,
                    requiredQuantity: requiredSemifinished.requiredQuantity
                }));

                await FinishedSemifinished.bulkCreate(bulkRows);
            }

            const updatedFinished = await Finished.findByPk(finished.id, {
                include: configIncludeRequireds("SHORT", "SHORT")
            });
            if (updatedFinished) res.status(200).send(toFinishedDTO(updatedFinished, "SHORT", "SHORT") as FinishedResponseDTO);
            else res.status(404).send('Updated finished not found!');
        } else res.status(404).send('Finished not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Finished with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete finished
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search finished by id
        const finished = await Finished.findByPk(id);
        if (finished) {
            await finished.destroy();

            res.status(200).send(`Finished with id ${id} deleted successfully!`);
        } else res.status(404).send('Finished not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}