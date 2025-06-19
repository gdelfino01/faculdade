import express from 'express';
import { Op } from 'sequelize';

import RawMaterial from '../../models/raw-material';

import {
    PostRawMaterialBodyDTO,
    UpdateRawMaterialBodyDTO,
    GetRawMaterialsParamsDTO,
    RawMaterialResponseDTO
} from './dtos';

// Get raw material by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search raw material by id
        const rawMaterial = await RawMaterial.findByPk(id);

        if (rawMaterial) res.status(200).send(rawMaterial as RawMaterialResponseDTO);
        else res.status(404).send('Raw material not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get raw materials
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetRawMaterialsParamsDTO;
        let {
            search,
            createdAfterDate,
            createdBeforeDate
        } = reqParams;

        const rawMaterials = await RawMaterial.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { subtype: { [Op.like]: `%${search}%` } }
                    ]
                }),
                ...(createdAfterDate && { createdAt: { [Op.gte]: new Date(createdAfterDate) } }),
                ...(createdBeforeDate && { createdAt: { [Op.lte]: new Date(createdBeforeDate) } })
            }
        });

        res.status(200).send(rawMaterials as RawMaterialResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Create raw material
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostRawMaterialBodyDTO;

        const rawMaterial = await RawMaterial.create(reqBody);
        res.status(200).send(rawMaterial as RawMaterialResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Raw material with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Update raw material
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateRawMaterialBodyDTO;

        // Search raw material by id
        let rawMaterial = await RawMaterial.findByPk(id);

        if (rawMaterial) {
            rawMaterial = await rawMaterial.update(reqBody);

            res.status(200).send(rawMaterial as RawMaterialResponseDTO);
        } else res.status(404).send('Raw material not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Raw material with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete raw material
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search raw material by id
        const rawMaterial = await RawMaterial.findByPk(id);
        if (rawMaterial) {
            await rawMaterial.destroy();

            res.status(200).send(`Raw material with id ${id} deleted successfully!`);
        } else res.status(404).send('Raw material not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}