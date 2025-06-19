import express from 'express';
import { Op } from 'sequelize';

import FinishedProductionOrder from '../../models/finished-production-order';
import FinishedLot from '../../models/finished-lot';

import {
    PostFinishedProductionOrderBodyDTO,
    UpdateFinishedProductionOrderBodyDTO,
    GetFinishedProductionOrdersParamsDTO,
    FinishedProductionOrderResponseDTO
} from './dtos';

// Get finishedProductionOrder by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search finishedProductionOrder by id
        const finishedProductionOrder = await FinishedProductionOrder.findByPk(id, {
            include: [{
                model: FinishedLot,
                as: 'finishedLot'
            }
        ]});

        if (finishedProductionOrder) res.status(200).send(finishedProductionOrder as FinishedProductionOrderResponseDTO);
        else res.status(404).send('Finished production order not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get finishedProductionOrders
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetFinishedProductionOrdersParamsDTO;
        let {
            search,
            issuedAfterDate,
            issuedBeforeDate,
            finishedId,
            status
        } = reqParams;

        const finishedProductionOrders = await FinishedProductionOrder.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { finishedLotSku: { [Op.like]: `%${search}%` } },
                        { details: { [Op.like]: `%${search}%` } },
                        { status: { [Op.like]: `%${search}%` } }
                    ]
                }),
                ...(issuedAfterDate && {
                    issueDate: { [Op.gte]: new Date(issuedAfterDate) }
                }),
                ...(issuedBeforeDate && {
                    issueDate: { [Op.lte]: new Date(issuedBeforeDate) }
                }),
                ...(finishedId && { finishedId }),
                ...(status && { status })
            },
            include: [{
                model: FinishedLot,
                as: 'finishedLot'
            }]
        });
        res.status(200).send(finishedProductionOrders as FinishedProductionOrderResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Create finishedProductionOrder
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostFinishedProductionOrderBodyDTO;

        const finishedProductionOrder = await FinishedProductionOrder.create(reqBody);
        res.status(200).send(finishedProductionOrder as FinishedProductionOrderResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Finished production order with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related finished lot is already paired with another finished production order!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Update finishedProductionOrder
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateFinishedProductionOrderBodyDTO;

        // Search finishedProductionOrder by id
        let finishedProductionOrder = await FinishedProductionOrder.findByPk(id);

        if (finishedProductionOrder) {
            finishedProductionOrder = await finishedProductionOrder.update(reqBody);

            res.status(200).send(finishedProductionOrder as FinishedProductionOrderResponseDTO);
        } else res.status(404).send('FinishedProductionOrder not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Finished production order with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related finished lot is already paired with another finished production order!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete finishedProductionOrder
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search finishedProductionOrder by id
        const finishedProductionOrder = await FinishedProductionOrder.findByPk(id);
        if (finishedProductionOrder) {
            await finishedProductionOrder.destroy();

            res.status(200).send(`Finished production order with id ${id} deleted successfully!`);
        } else res.status(404).send('Finished production order not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}