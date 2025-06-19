import express from 'express';
import { Op } from 'sequelize';

import Semifinished from '../../models/semifinished';
import SemifinishedLot from '../../models/semifinished-lot';
import MaterialLot from '../../models/material-lot';
import SemifinishedLotMaterialLot from '../../models/semifinished-lot-material-lot';
import SemifinishedProductionOrder from '../../models/semifinished-production-order';

import {
    GetSemifinishedLotParamsDTO,
    GetSemifinishedLotsParamsDTO,
    PostSemifinishedLotBodyDTO,
    UpdateSemifinishedLotBodyDTO,
    SemifinishedLotResponseDTO,
    SemifinishedLotMaterialLotShortDTO
} from './dtos';

const configIncludeConsumedMaterialLots = (
    includeConsumedMaterialLots: GetSemifinishedLotParamsDTO['includeConsumedMaterialLots']
): Record<string, unknown>[] | undefined => {
    const semifinished = {
        model: Semifinished,
        as: 'semifinished'
    };

    const semifinishedProductionOrder = {
        model: SemifinishedProductionOrder,
        as: 'semifinishedProductionOrder',
    };

    return includeConsumedMaterialLots === 'NO' ? [semifinished, semifinishedProductionOrder] : [{
        model: MaterialLot,
        as: 'consumedMaterialLots',
        attributes: includeConsumedMaterialLots === 'SHORT' ? ['id'] : undefined,
        through: { attributes: ['consumedQuantity'] }
    },
    semifinished, semifinishedProductionOrder ];
};

const toSemifinishedLotDTO = (
    entity: SemifinishedLot,
    mode: GetSemifinishedLotParamsDTO['includeConsumedMaterialLots']
): SemifinishedLotResponseDTO => {
    const { semifinishedId, semifinishedProductionOrderId, ...semifinishedLotWithoutIds } = entity.get({ plain: true });

    const { semifinished, semifinishedProductionOrder, ...semifinishedLotWithoutIncludes } = semifinishedLotWithoutIds;
    const { requiredMaterials, ...semifinishedWithoutRequiredMaterials } = semifinished;
    const { semifinishedLot, ...semifinishedProductionOrderWithoutSemifinishedLot } = semifinishedProductionOrder;

    const restructuredSemifinishedLot = {
        ...semifinishedLotWithoutIncludes,
        semifinished: semifinishedWithoutRequiredMaterials,
        semifinishedProductionOrder: semifinishedProductionOrderWithoutSemifinishedLot
    };

    const consumedMaterialLots = mode === 'NO' ? undefined : restructuredSemifinishedLot.consumedMaterialLots.map(materialLot => {
        const consumedQuantity = materialLot.SemifinishedLotMaterialLot?.consumedQuantity;

        const { SemifinishedLotMaterialLot, ...restMaterialLot } = materialLot;
        const materialLotDTO = restMaterialLot;

        return mode === 'SHORT'
            ? { materialLotId: materialLotDTO.id, consumedQuantity }
            : { materialLot: materialLotDTO, consumedQuantity };
    });

    return {
        ...restructuredSemifinishedLot,
        consumedMaterialLots
    };
};

async function validateConsumedMaterialLots (
    semifinishedLot: SemifinishedLot,
    consumedMaterialLots: SemifinishedLotMaterialLotShortDTO[]
): Promise<string | null> {
    if (new Set(consumedMaterialLots.map(consumedMaterial => consumedMaterial.materialLotId)).size !== consumedMaterialLots.length) return 'Duplicate lots amongst informed consumed material lots';

    const materialLotIds = consumedMaterialLots.map(consumedMaterial => consumedMaterial.materialLotId);
    const materialLots = await MaterialLot.findAll({ where: { id: { [Op.in]: materialLotIds } } });
    const materialLotMap = new Map(materialLots.map(materialLot => [materialLot.id, materialLot]));

    const requiredMaterials = semifinishedLot.semifinished.requiredMaterials;
    if (!requiredMaterials || !Array.isArray(requiredMaterials)) return 'Required materials are not properly defined for the semifinished product';

    const requiredMaterialsMap = new Map(requiredMaterials.map(requiredMaterial => [
        requiredMaterial.SemifinishedMaterial.materialId, 
        requiredMaterial.SemifinishedMaterial.requiredQuantity
    ]));

    const materialConsumedQuantity = new Map<number, number>();

    for (const consumedMaterialLot of consumedMaterialLots) {
        const materialLot = materialLotMap.get(consumedMaterialLot.materialLotId);
        if (!materialLot) return `Material lot with ID ${consumedMaterialLot.materialLotId} not found`;

        const materialId = materialLot.materialId;
        if (requiredMaterialsMap.get(materialId) === undefined) return `Material with ID ${materialId} from material lot with ID ${materialLot.id} is not required by the semifinished product`;

        const previousQuantity = materialConsumedQuantity.get(materialId) || 0;
        materialConsumedQuantity.set(materialId, previousQuantity + consumedMaterialLot.consumedQuantity);
    }

    for (const [materialId, totalConsumedQuantity] of materialConsumedQuantity.entries()) {
        const requiredQuantity = requiredMaterialsMap.get(materialId);
        if (requiredQuantity !== undefined) {
            if (totalConsumedQuantity > requiredQuantity) return `Material with ID ${materialId}'s consumed quantity (${totalConsumedQuantity}) exceeds the required quantity (${requiredQuantity})`;
            else if (totalConsumedQuantity < requiredQuantity) return `Material with ID ${materialId}'s consumed quantity (${totalConsumedQuantity}) is less than the required quantity (${requiredQuantity})`;
        }
    }

    for (const materialId of requiredMaterialsMap.keys()) {
        if (!materialConsumedQuantity.has(materialId)) return `Material with ID ${materialId} is required by the semifinished product, but is missing amongst informed materials`;
    }

    return null;
}

// Get semifinishedLot by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { includeConsumedMaterialLots = 'SHORT' } = req.query as GetSemifinishedLotParamsDTO;

        const semifinishedLot = await SemifinishedLot.findByPk(id, {
            include: configIncludeConsumedMaterialLots(includeConsumedMaterialLots)
        });

        if (semifinishedLot) res.status(200).send(toSemifinishedLotDTO(semifinishedLot, includeConsumedMaterialLots) as SemifinishedLotResponseDTO);
        else res.status(404).send('Semifinished lot not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Get semifinishedLot by SKU
export const getBySKU = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const sku = req.params.sku;
        const { includeConsumedMaterialLots = 'SHORT' } = req.query as GetSemifinishedLotParamsDTO;

        const semifinishedLot = await SemifinishedLot.findOne({
            where: { sku },
            include: configIncludeConsumedMaterialLots(includeConsumedMaterialLots)
        });

        if (semifinishedLot) res.status(200).send(toSemifinishedLotDTO(semifinishedLot, includeConsumedMaterialLots) as SemifinishedLotResponseDTO);
        else res.status(404).send('Semifinished lot not found!');
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
        const reqParams = req.query as GetSemifinishedLotsParamsDTO;
        const {
            search,
            startedAfterDate,
            endedBeforeDate,
            includeConsumedMaterialLots = 'SHORT',
            semifinishedId,
            onlyAvailable
        } = reqParams;

        const semifinisheds = await SemifinishedLot.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { sku: { [Op.like]: `%${search}%` } },
                    ]
                }),
                ...(startedAfterDate && {
                    startDate: { [Op.gte]: new Date(startedAfterDate) }
                }),
                ...(endedBeforeDate && {
                    endDate: { [Op.lte]: new Date(endedBeforeDate) }
                }),
                ...(onlyAvailable && { availableQuantity: { [Op.gt]: 0 } }),
                ...(semifinishedId && { semifinishedId })
            },
            include: configIncludeConsumedMaterialLots(includeConsumedMaterialLots)
        });

        res.status(200).send(semifinisheds.map(semifinishedLot => toSemifinishedLotDTO(semifinishedLot, includeConsumedMaterialLots)) as SemifinishedLotResponseDTO[]);

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
        const reqBody = req.body as PostSemifinishedLotBodyDTO;
        const { consumedMaterialLots, ...semifinishedData } = reqBody;

        const semifinishedLot = await SemifinishedLot.create(semifinishedData);

        if (consumedMaterialLots?.length) {
            const checkConsumedMaterialLots = await validateConsumedMaterialLots(semifinishedLot, consumedMaterialLots);
            if (checkConsumedMaterialLots) {
                await semifinishedLot.destroy();
                res.status(400).send(checkConsumedMaterialLots);
                return;
            }

            const bulkRows = consumedMaterialLots.map(consumedMaterialLot => ({
                semifinishedLotId: semifinishedLot.id,
                materialLotId: consumedMaterialLot.materialLotId,
                consumedQuantity: consumedMaterialLot.consumedQuantity
            }));

            await SemifinishedLotMaterialLot.bulkCreate(bulkRows);
        }

        const createdSemifinished = await SemifinishedLot.findByPk(semifinishedLot.id, {
            include: configIncludeConsumedMaterialLots("SHORT")
        });
        if (createdSemifinished) res.status(200).send(toSemifinishedLotDTO(createdSemifinished, 'SHORT') as SemifinishedLotResponseDTO);
        else res.status(404).send('Created semifinishedLot not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished lot with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related semifinished production order is already paired with another semifinished lot!');
            else if (err.name === 'StockError' || err.name === 'SemifinishedMismatchError') res.status(400).send(err.message);
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
        const reqBody = req.body as UpdateSemifinishedLotBodyDTO;
        const { consumedMaterialLots, ...updateData } = reqBody;

        let semifinishedLot = await SemifinishedLot.findByPk(id);

        if (semifinishedLot) {
            if (reqBody.producedQuantityOK || reqBody.producedQuantityNG) {
                const quantityOk = reqBody.producedQuantityOK;
                const quantityNg = reqBody.producedQuantityNG;
                const producedQuantity = (quantityOk ?? 0) + (quantityNg ?? 0);
                const availableQuantity = semifinishedLot.availableQuantity;
                if (producedQuantity < availableQuantity) res.status(400).send('Produced quantity cannot be less than available quantity!');
            }

            semifinishedLot = await semifinishedLot.update(updateData);

            if (consumedMaterialLots?.length) {
                const checkConsumedMaterialLots = await validateConsumedMaterialLots(semifinishedLot, consumedMaterialLots);
                if (checkConsumedMaterialLots) {
                    res.status(400).send(checkConsumedMaterialLots);
                    return;
                }

                await SemifinishedLotMaterialLot.destroy({ where: { semifinishedLotId: id } });

                const bulkRows = consumedMaterialLots.map(consumedMaterialLot => ({
                    semifinishedLotId: Number(id),
                    materialLotId: consumedMaterialLot.materialLotId,
                    consumedQuantity: consumedMaterialLot.consumedQuantity
                }));

                await SemifinishedLotMaterialLot.bulkCreate(bulkRows);
            }

            const updatedSemifinished = await SemifinishedLot.findByPk(semifinishedLot.id, {
                include: configIncludeConsumedMaterialLots("SHORT")
            });
            if (updatedSemifinished) res.status(200).send(toSemifinishedLotDTO(updatedSemifinished, 'SHORT') as SemifinishedLotResponseDTO);
            else res.status(404).send('Updated semifinishedLot not found!');
        } else res.status(404).send('Semifinished lot not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished lot with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related semifinished production order is already paired with another semifinished lot!');
            else if (err.name === 'StockError' || err.name === 'SemifinishedMismatchError') res.status(400).send(err.message);
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete semifinishedLot
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search semifinishedLot by id
        const semifinishedLot = await SemifinishedLot.findByPk(id);
        if (semifinishedLot) {
            await semifinishedLot.destroy();

            res.status(200).send(`Semifinished lot with id ${id} deleted successfully!`);
        } else res.status(404).send('Semifinished lot not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}