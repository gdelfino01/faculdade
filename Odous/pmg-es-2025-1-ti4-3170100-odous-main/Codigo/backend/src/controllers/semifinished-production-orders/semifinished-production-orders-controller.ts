import express from 'express';
import { Op } from 'sequelize';

import SemifinishedProductionOrder from '../../models/semifinished-production-order';
import SemifinishedLot from '../../models/semifinished-lot';

import {
    PostSemifinishedProductionOrderBodyDTO,
    UpdateSemifinishedProductionOrderBodyDTO,
    GetSemifinishedProductionOrdersParamsDTO,
    SemifinishedProductionOrderResponseDTO
} from './dtos';

// Get semifinishedProductionOrder by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search semifinishedProductionOrder by id
        const semifinishedProductionOrder = await SemifinishedProductionOrder.findByPk(id, {
            include: [{
                model: SemifinishedLot,
                as: 'semifinishedLot'
            }
        ]});

        if (semifinishedProductionOrder) res.status(200).send(semifinishedProductionOrder as SemifinishedProductionOrderResponseDTO);
        else res.status(404).send('Semifinished production order not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get semifinishedProductionOrders
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetSemifinishedProductionOrdersParamsDTO;
        let {
            search,
            issuedAfterDate,
            issuedBeforeDate,
            semifinishedId,
            status
        } = reqParams;

        const semifinishedProductionOrders = await SemifinishedProductionOrder.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { semifinishedLotSku: { [Op.like]: `%${search}%` } },
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
                ...(semifinishedId && { semifinishedId }),
                ...(status && { status })
            },
            include: [{
                model: SemifinishedLot,
                as: 'semifinishedLot'
            }]
        });
        res.status(200).send(semifinishedProductionOrders as SemifinishedProductionOrderResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Create semifinishedProductionOrder
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostSemifinishedProductionOrderBodyDTO;

        const semifinishedProductionOrder = await SemifinishedProductionOrder.create(reqBody);
        res.status(200).send(semifinishedProductionOrder as SemifinishedProductionOrderResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished production order with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related semifinished lot is already paired with another semifinished production order!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Update semifinishedProductionOrder
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateSemifinishedProductionOrderBodyDTO;

        // Search semifinishedProductionOrder by id
        let semifinishedProductionOrder = await SemifinishedProductionOrder.findByPk(id);

        if (semifinishedProductionOrder) {
            semifinishedProductionOrder = await semifinishedProductionOrder.update(reqBody);

            res.status(200).send(semifinishedProductionOrder as SemifinishedProductionOrderResponseDTO);
        } else res.status(404).send('SemifinishedProductionOrder not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished production order with provided info already exists!');
            else if (err.name === 'SequelizeForeignKeyConstraintError') res.status(400).send('The related semifinished lot is already paired with another semifinished production order!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete semifinishedProductionOrder
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search semifinishedProductionOrder by id
        const semifinishedProductionOrder = await SemifinishedProductionOrder.findByPk(id);
        if (semifinishedProductionOrder) {
            await semifinishedProductionOrder.destroy();

            res.status(200).send(`Semifinished production order with id ${id} deleted successfully!`);
        } else res.status(404).send('Semifinished production order not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}