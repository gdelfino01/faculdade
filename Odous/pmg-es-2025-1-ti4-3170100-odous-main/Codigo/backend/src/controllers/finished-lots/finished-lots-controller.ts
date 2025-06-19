import express from 'express';
import { Op } from 'sequelize';

import Finished from '../../models/finished';
import FinishedLot from '../../models/finished-lot';
import MaterialLot from '../../models/material-lot';
import SemifinishedLot from '../../models/semifinished-lot';
import FinishedLotMaterialLot from '../../models/finished-lot-material-lot';
import FinishedLotSemifinishedLot from '../../models/finished-lot-semifinished-lot';
import FinishedProductionOrder from '../../models/finished-production-order';

import {
    GetFinishedLotParamsDTO,
    GetFinishedLotsParamsDTO,
    PostFinishedLotBodyDTO,
    UpdateFinishedLotBodyDTO,
    FinishedLotResponseDTO,
    FinishedLotMaterialLotShortDTO,
    FinishedLotSemifinishedLotShortDTO
} from './dtos';

const configIncludeConsumedLots = (
    includeConsumedMaterialLots: GetFinishedLotParamsDTO['includeConsumedMaterialLots'],
    includeConsumedSemifinishedLots: GetFinishedLotParamsDTO['includeConsumedSemifinishedLots']
): Record<string, unknown>[] | undefined => {
    const finished = {
        model: Finished,
        as: 'finished'
    };

    const finishedProductionOrder = {
        model: FinishedProductionOrder,
        as: 'finishedProductionOrder',
    };

    const materialLot = includeConsumedMaterialLots === 'NO' ? [] : [{
        model: MaterialLot,
        as: 'consumedMaterialLots',
        attributes: includeConsumedMaterialLots === 'SHORT' ? ['id'] : undefined,
        through: { attributes: ['consumedQuantity'] }
    }];

    const semifinishedLot = includeConsumedSemifinishedLots === 'NO' ? [] : [{
        model: SemifinishedLot,
        as: 'consumedSemifinishedLots',
        attributes: includeConsumedSemifinishedLots === 'SHORT' ? ['id'] : undefined,
        through: { attributes: ['consumedQuantity'] }
    }];

    return [ ...materialLot, ...semifinishedLot, finished, finishedProductionOrder ];
};

const toFinishedLotDTO = (
    entity: FinishedLot,
    materialLotMode: GetFinishedLotParamsDTO['includeConsumedMaterialLots'],
    semifinishedLotMode: GetFinishedLotParamsDTO['includeConsumedSemifinishedLots']
): FinishedLotResponseDTO => {
    const { finishedId, finishedProductionOrderId, ...finishedLotWithoutIds } = entity.get({ plain: true });

    const { finished, finishedProductionOrder, ...finishedLotWithoutIncludes } = finishedLotWithoutIds;
    const { requiredMaterials, requiredSemifinisheds, anvisaRegister, ...finishedWithoutRequireds } = finished;
    const { finishedLot, ...finishedProductionOrderWithoutFinishedLot } = finishedProductionOrder;

    const restructuredFinishedLot = {
        ...finishedLotWithoutIncludes,
        finished: finishedWithoutRequireds,
        finishedProductionOrder: finishedProductionOrderWithoutFinishedLot
    };

    const consumedMaterialLots = materialLotMode === 'NO' ? undefined : restructuredFinishedLot.consumedMaterialLots.map(materialLot => {
        const consumedQuantity = materialLot.FinishedLotMaterialLot?.consumedQuantity;

        const { FinishedLotMaterialLot, ...restMaterialLot } = materialLot;
        const materialLotDTO = restMaterialLot;

        return materialLotMode === 'SHORT'
            ? { materialLotId: materialLotDTO.id, consumedQuantity }
            : { materialLot: materialLotDTO, consumedQuantity };
    });

    const consumedSemifinishedLots = semifinishedLotMode === 'NO' ? undefined : restructuredFinishedLot.consumedSemifinishedLots.map(semifinishedLot => {
        const consumedQuantity = semifinishedLot.FinishedLotSemifinishedLot?.consumedQuantity;

        const { FinishedLotSemifinishedLot, consumedMaterialLots, semifinished, semifinishedId, semifinishedProductionOrder, ...restSemifinishedLot } = semifinishedLot;
        const { requiredMaterials, ...restSemifinished } = semifinished || {};

        const reestructuredSemifinishedLot = { ...restSemifinishedLot, semifinished: restSemifinished };

        const semifinishedLotDTO = reestructuredSemifinishedLot;

        return semifinishedLotMode === 'SHORT'
            ? { semifinishedLotId: semifinishedLotDTO.id, consumedQuantity }
            : { semifinishedLot: semifinishedLotDTO, consumedQuantity };
    });

    return {
        ...restructuredFinishedLot,
        consumedMaterialLots,
        consumedSemifinishedLots
    };
};

async function validateConsumedMaterialLots (
    finishedLot: FinishedLot,
    consumedMaterialLots: FinishedLotMaterialLotShortDTO[]
): Promise<string | null> {
    if (new Set(consumedMaterialLots.map(consumedMaterial => consumedMaterial.materialLotId)).size !== consumedMaterialLots.length) return 'Duplicate lots amongst informed consumed material lots';

    const materialLotIds = consumedMaterialLots.map(consumedMaterial => consumedMaterial.materialLotId);
    const materialLots = await MaterialLot.findAll({ where: { id: { [Op.in]: materialLotIds } } });
    const materialLotMap = new Map(materialLots.map(materialLot => [materialLot.id, materialLot]));

    const requiredMaterials = finishedLot.finished.requiredMaterials;
    if (!requiredMaterials || !Array.isArray(requiredMaterials)) return 'Required materials are not properly defined for the finished product';

    const requiredMaterialsMap = new Map(requiredMaterials.map(requiredMaterial => [
        requiredMaterial.FinishedMaterial.materialId, 
        requiredMaterial.FinishedMaterial.requiredQuantity
    ]));

    const materialConsumedQuantity = new Map<number, number>();

    for (const consumedMaterialLot of consumedMaterialLots) {
        const materialLot = materialLotMap.get(consumedMaterialLot.materialLotId);
        if (!materialLot) return `Material lot with ID ${consumedMaterialLot.materialLotId} not found`;

        const materialId = materialLot.materialId;
        if (requiredMaterialsMap.get(materialId) === undefined) return `Material with ID ${materialId} from material lot with ID ${materialLot.id} is not required by the finished product`;

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
        if (!materialConsumedQuantity.has(materialId)) return `Material with ID ${materialId} is required by the finished product, but is missing amongst informed materials`;
    }

    return null;
}

async function validateConsumedSemifinishedLots (
    finishedLot: FinishedLot,
    consumedSemifinishedLots: FinishedLotSemifinishedLotShortDTO[]
): Promise<string | null> {
    if (new Set(consumedSemifinishedLots.map(consumedSemifinished => consumedSemifinished.semifinishedLotId)).size !== consumedSemifinishedLots.length) return 'Duplicate lots amongst informed consumed semifinished lots';

    const semifinishedLotIds = consumedSemifinishedLots.map(consumedSemifinished => consumedSemifinished.semifinishedLotId);
    const semifinishedLots = await SemifinishedLot.findAll({ where: { id: { [Op.in]: semifinishedLotIds } } });
    const semifinishedLotMap = new Map(semifinishedLots.map(semifinishedLot => [semifinishedLot.id, semifinishedLot]));

    const requiredSemifinisheds = finishedLot.finished.requiredSemifinisheds;
    if (!requiredSemifinisheds || !Array.isArray(requiredSemifinisheds)) return 'Required semifinisheds are not properly defined for the finished product';

    const requiredSemifinishedsMap = new Map(requiredSemifinisheds.map(requiredSemifinished => [
        requiredSemifinished.FinishedSemifinished.semifinishedId, 
        requiredSemifinished.FinishedSemifinished.requiredQuantity
    ]));

    const semifinishedConsumedQuantity = new Map<number, number>();

    for (const consumedSemifinishedLot of consumedSemifinishedLots) {
        const semifinishedLot = semifinishedLotMap.get(consumedSemifinishedLot.semifinishedLotId);
        if (!semifinishedLot) return `Semifinished lot with ID ${consumedSemifinishedLot.semifinishedLotId} not found`;

        const semifinishedId = semifinishedLot.semifinishedId;
        if (requiredSemifinishedsMap.get(semifinishedId) === undefined) return `Semifinished with ID ${semifinishedId} from semifinished lot with ID ${semifinishedLot.id} is not required by the finished product`;

        const previousQuantity = semifinishedConsumedQuantity.get(semifinishedId) || 0;
        semifinishedConsumedQuantity.set(semifinishedId, previousQuantity + consumedSemifinishedLot.consumedQuantity);
    }

    for (const [semifinishedId, totalConsumedQuantity] of semifinishedConsumedQuantity.entries()) {
        const requiredQuantity = requiredSemifinishedsMap.get(semifinishedId);
        if (requiredQuantity !== undefined) {
            if (totalConsumedQuantity > requiredQuantity) return `Semifinished with ID ${semifinishedId}'s consumed quantity (${totalConsumedQuantity}) exceeds the required quantity (${requiredQuantity})`;
            else if (totalConsumedQuantity < requiredQuantity) return `Semifinished with ID ${semifinishedId}'s consumed quantity (${totalConsumedQuantity}) is less than the required quantity (${requiredQuantity})`;
        }
    }

    for (const semifinishedId of requiredSemifinishedsMap.keys()) {
        if (!semifinishedConsumedQuantity.has(semifinishedId)) return `Semifinished with ID ${semifinishedId} is required by the finished product, but is missing amongst informed semifinisheds`;
    }

    return null;
}

// Get finishedLot by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            includeConsumedMaterialLots = 'SHORT',
            includeConsumedSemifinishedLots = 'SHORT'
        } = req.query as GetFinishedLotParamsDTO;

        const finishedLot = await FinishedLot.findByPk(id, {
            include: configIncludeConsumedLots(includeConsumedMaterialLots, includeConsumedSemifinishedLots)
        });

        if (finishedLot) res.status(200).send(toFinishedLotDTO(finishedLot, includeConsumedMaterialLots, includeConsumedSemifinishedLots) as FinishedLotResponseDTO);
        else res.status(404).send('Finished lot not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Get finishedLot by SKU
export const getBySKU = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const sku = req.params.sku;
        const {
            includeConsumedMaterialLots = 'SHORT',
            includeConsumedSemifinishedLots = 'SHORT'
        } = req.query as GetFinishedLotParamsDTO;

        const finishedLot = await FinishedLot.findOne({
            where: { sku },
            include: configIncludeConsumedLots(includeConsumedMaterialLots, includeConsumedSemifinishedLots)
        });

        if (finishedLot) res.status(200).send(toFinishedLotDTO(finishedLot, includeConsumedMaterialLots, includeConsumedSemifinishedLots) as FinishedLotResponseDTO);
        else res.status(404).send('Finished lot not found!');
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
        const reqParams = req.query as GetFinishedLotsParamsDTO;
        const {
            search,
            startedAfterDate,
            endedBeforeDate,
            includeConsumedMaterialLots = 'SHORT',
            includeConsumedSemifinishedLots = 'SHORT',
            finishedId,
            onlyAvailable
        } = reqParams;

        const finisheds = await FinishedLot.findAll({
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
                ...(finishedId && { finishedId })
            },
            include: configIncludeConsumedLots(includeConsumedMaterialLots, includeConsumedSemifinishedLots)
        });

        res.status(200).send(finisheds.map(finishedLot => toFinishedLotDTO(finishedLot, includeConsumedMaterialLots, includeConsumedSemifinishedLots)) as FinishedLotResponseDTO[]);

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
        const reqBody = req.body as PostFinishedLotBodyDTO;
        const {
            consumedMaterialLots,
            consumedSemifinishedLots,
            ...finishedData
        } = reqBody;

        const finishedLot = await FinishedLot.create(finishedData);

        await finishedLot.reload({
            include: [{
                model: Finished,
                as: 'finished',
                include: [
                    { association: 'requiredMaterials' },
                    { association: 'requiredSemifinisheds' }
                ]
            }]
        });

        if (consumedMaterialLots?.length) {
            const checkConsumedMaterialLots = await validateConsumedMaterialLots(finishedLot, consumedMaterialLots);
            if (checkConsumedMaterialLots) {
                await finishedLot.destroy();
                res.status(400).send(checkConsumedMaterialLots);
                return;
            }

            const bulkRows = consumedMaterialLots.map(consumedMaterialLot => ({
                finishedLotId: finishedLot.id,
                materialLotId: consumedMaterialLot.materialLotId,
                consumedQuantity: consumedMaterialLot.consumedQuantity
            }));

            await FinishedLotMaterialLot.bulkCreate(bulkRows);
        }

        if (consumedSemifinishedLots?.length) {
            const checkConsumedSemifinishedLots = await validateConsumedSemifinishedLots(finishedLot, consumedSemifinishedLots);
            if (checkConsumedSemifinishedLots) {
                await finishedLot.destroy();
                res.status(400).send(checkConsumedSemifinishedLots);
                return;
            }

            const bulkRows = consumedSemifinishedLots.map(consumedSemifinishedLot => ({
                finishedLotId: finishedLot.id,
                semifinishedLotId: consumedSemifinishedLot.semifinishedLotId,
                consumedQuantity: consumedSemifinishedLot.consumedQuantity
            }));

            await FinishedLotSemifinishedLot.bulkCreate(bulkRows);
        }

        const createdFinished = await FinishedLot.findByPk(finishedLot.id, {
            include: configIncludeConsumedLots("SHORT", "SHORT")
        });
        if (createdFinished) res.status(200).send(toFinishedLotDTO(createdFinished, "SHORT", "SHORT") as FinishedLotResponseDTO);
        else res.status(404).send('Created finishedLot not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Finished lot with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related finished production order is already paired with another finished lot!');
            else if (err.name === 'StockError' || err.name === 'FinishedMismatchError') res.status(400).send(err.message);
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
        const reqBody = req.body as UpdateFinishedLotBodyDTO;
        const {
            consumedMaterialLots,
            consumedSemifinishedLots,
            ...updateData
        } = reqBody;

        let finishedLot = await FinishedLot.findByPk(id);

        if (finishedLot) {
            await finishedLot.reload({
                include: [{
                    model: Finished,
                    as: 'finished',
                    include: [
                        { association: 'requiredMaterials' },
                        { association: 'requiredSemifinisheds' }
                    ]
                }]
            });

            if (reqBody.producedQuantityOK || reqBody.producedQuantityNG) {
                const quantityOk = reqBody.producedQuantityOK;
                const quantityNg = reqBody.producedQuantityNG;
                const producedQuantity = (quantityOk ?? 0) + (quantityNg ?? 0);
                const availableQuantity = finishedLot.availableQuantity;
                if (producedQuantity < availableQuantity) res.status(400).send('Produced quantity cannot be less than available quantity!');
            }

            finishedLot = await finishedLot.update(updateData);

            if (consumedMaterialLots?.length) {
                const checkConsumedMaterialLots = await validateConsumedMaterialLots(finishedLot, consumedMaterialLots);
                if (checkConsumedMaterialLots) {
                    res.status(400).send(checkConsumedMaterialLots);
                    return;
                }

                await FinishedLotMaterialLot.destroy({ where: { finishedLotId: id } });

                const bulkRows = consumedMaterialLots.map(consumedMaterialLot => ({
                    finishedLotId: Number(id),
                    materialLotId: consumedMaterialLot.materialLotId,
                    consumedQuantity: consumedMaterialLot.consumedQuantity
                }));

                await FinishedLotMaterialLot.bulkCreate(bulkRows);
            }

            if (consumedSemifinishedLots?.length) {
                const checkConsumedSemifinishedLots = await validateConsumedSemifinishedLots(finishedLot, consumedSemifinishedLots);
                if (checkConsumedSemifinishedLots) {
                    res.status(400).send(checkConsumedSemifinishedLots);
                    return;
                }

                await FinishedLotSemifinishedLot.destroy({ where: { finishedLotId: id } });

                const bulkRows = consumedSemifinishedLots.map(consumedSemifinishedLot => ({
                    finishedLotId: Number(id),
                    semifinishedLotId: consumedSemifinishedLot.semifinishedLotId,
                    consumedQuantity: consumedSemifinishedLot.consumedQuantity
                }));

                await FinishedLotSemifinishedLot.bulkCreate(bulkRows);
            }

            const updatedFinished = await FinishedLot.findByPk(finishedLot.id, {
                include: configIncludeConsumedLots("SHORT", "SHORT")
            });
            if (updatedFinished) res.status(200).send(toFinishedLotDTO(updatedFinished, "SHORT", "SHORT") as FinishedLotResponseDTO);
            else res.status(404).send('Updated finishedLot not found!');
        } else res.status(404).send('Finished lot not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Finished lot with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related finished production order is already paired with another finished lot!');
            else if (err.name === 'StockError' || err.name === 'FinishedMismatchError') res.status(400).send(err.message);
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete finishedLot
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search finishedLot by id
        const finishedLot = await FinishedLot.findByPk(id);
        if (finishedLot) {
            await finishedLot.destroy();

            res.status(200).send(`Finished lot with id ${id} deleted successfully!`);
        } else res.status(404).send('Finished lot not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}