import express from 'express';
import { Op } from 'sequelize';

import MaterialLot from '../../models/material-lot';
import Material from '../../models/material';

import {
    PostMaterialLotBodyDTO,
    UpdateMaterialLotBodyDTO,
    GetMaterialLotsParamsDTO,
    MaterialLotResponseDTO
} from './dtos';

// Get material lot by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search material lot by id
        const materialLot = await MaterialLot.findByPk(id, {
            include: [{
                model: Material,
                as: 'material'
            }]
        });

        if (materialLot) res.status(200).send(materialLot as MaterialLotResponseDTO);
        else res.status(404).send('Material lot not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get material lots
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetMaterialLotsParamsDTO;
        let {
            search,
            createdAfterDate,
            createdBeforeDate,
            materialId,
            onlyAvailable,
            invoiceCode
        } = reqParams;

        const materialLots = await MaterialLot.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { invoiceCode: { [Op.like]: `%${search}%` } }
                    ]
                }),
                ...(createdAfterDate && { createdAt: { [Op.gte]: new Date(createdAfterDate) } }),
                ...(createdBeforeDate && { createdAt: { [Op.lte]: new Date(createdBeforeDate) } }),
                ...(materialId && { materialId }),
                ...(onlyAvailable && { availableQuantity: { [Op.gt]: 0 } }),
                ...(invoiceCode && { invoiceCode })
            },
            include: [{
                model: Material,
                as: 'material'
            }]
        });

        res.status(200).send(materialLots as MaterialLotResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Create material lot
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostMaterialLotBodyDTO;

        const materialLot = await MaterialLot.create(reqBody);
        res.status(200).send(materialLot as MaterialLotResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Material lot with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Update material lot
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateMaterialLotBodyDTO;

        // Search material lot by id
        let materialLot = await MaterialLot.findByPk(id);

        if (materialLot) {
            if (reqBody.acquiredQuantity) {
                const acquiredQuantity = reqBody.acquiredQuantity;
                const availableQuantity = materialLot.availableQuantity;
                if (acquiredQuantity < availableQuantity) res.status(400).send('Acquired quantity cannot be less than available quantity!');
            }

            materialLot = await materialLot.update(reqBody);

            res.status(200).send(materialLot as MaterialLotResponseDTO);
        } else res.status(404).send('Material lot not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Material lot with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete material lot
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search material lot by id
        const materialLot = await MaterialLot.findByPk(id);
        if (materialLot) {
            await materialLot.destroy();

            res.status(200).send(`Material lot with id ${id} deleted successfully!`);
        } else res.status(404).send('Material lot not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}