import express from 'express';
import { Op } from 'sequelize';

import Material from '../../models/material';
import RawMaterial from '../../models/raw-material';

import {
    PostMaterialBodyDTO,
    UpdateMaterialBodyDTO,
    GetMaterialsParamsDTO,
    MaterialResponseDTO
} from './dtos';

// Get material by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search material by id
        const material = await Material.findByPk(id, {
            include: [{
                model: RawMaterial,
                as: 'rawMaterial'
            }]
        });

        if (material) res.status(200).send(material as MaterialResponseDTO);
        else res.status(404).send('Material not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get material by SKU
export const getBySKU = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const sku = req.params.sku;

        // Search material by SKU
        const material = await Material.findOne({
            where: { sku },
            include: [{
                model: RawMaterial,
                as: 'rawMaterial'
            }]
        });

        if (material) res.status(200).send(material as MaterialResponseDTO);
        else res.status(404).send('Material not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get materials
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetMaterialsParamsDTO;
        let {
            search,
            createdAfterDate,
            createdBeforeDate,
            measurementUnits,
            rawMaterialId
        } = reqParams;

        const materials = await Material.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { sku: { [Op.like]: `%${search}%` } },
                        { name: { [Op.like]: `%${search}%` } },
                        { measurementUnit: { [Op.like]: `%${search}%` } }
                    ]
                }),
                ...(createdAfterDate && { createdAt: { [Op.gte]: new Date(createdAfterDate) } }),
                ...(createdBeforeDate && { createdAt: { [Op.lte]: new Date(createdBeforeDate) } }),
                ...(measurementUnits && {
                    measurementUnit: {
                        [Op.in]: measurementUnits
                    }
                }),
                ...(rawMaterialId && { rawMaterialId })
            },
            include: [{
                model: RawMaterial,
                as: 'rawMaterial'
            }]
        });

        res.status(200).send(materials as MaterialResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Create material
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostMaterialBodyDTO;

        const material = await Material.create(reqBody);
        res.status(200).send(material as MaterialResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Material with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Update material
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateMaterialBodyDTO;

        // Search material by id
        let material = await Material.findByPk(id);

        if (material) {
            material = await material.update(reqBody);

            res.status(200).send(material as MaterialResponseDTO);
        } else res.status(404).send('Material not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Material with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete material
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search material by id
        const material = await Material.findByPk(id);
        if (material) {
            await material.destroy();

            res.status(200).send(`Material with id ${id} deleted successfully!`);
        } else res.status(404).send('Material not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}