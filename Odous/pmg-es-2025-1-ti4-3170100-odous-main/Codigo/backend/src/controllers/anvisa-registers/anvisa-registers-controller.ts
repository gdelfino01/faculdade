import express from 'express';
import { Op } from 'sequelize';

import AnvisaRegister from '../../models/anvisa-register';
import RawMaterial from '../../models/raw-material';
import Finished from '../../models/finished';

import {
    PostAnvisaRegisterBodyDTO,
    UpdateAnvisaRegisterBodyDTO,
    GetAnvisaRegistersParamsDTO,
    AnvisaRegisterResponseDTO
} from './dtos';

// Get ANVISA register by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search ANVISA register by id
        const anvisaRegister = await AnvisaRegister.findByPk(id, {
            include: [{
                model: RawMaterial,
                as: 'rawMaterial'
            },
            {
                model: Finished,
                as: 'finished',
            }
        ]});

        if (anvisaRegister) res.status(200).send(anvisaRegister as AnvisaRegisterResponseDTO);
        else res.status(404).send('ANVISA Register not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get ANVISA register by Code Number
export const getByCodeNumber = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const codeNumber = req.params.codeNumber;

        // Search ANVISA register by Code Number
        const anvisaRegister = await AnvisaRegister.findOne({
            where: { codeNumber },
            include: [{
                model: RawMaterial,
                as: 'rawMaterial'
            },
            {
                model: Finished,
                as: 'finished',
            }
        ]});

        if (anvisaRegister) res.status(200).send(anvisaRegister as AnvisaRegisterResponseDTO);
        else res.status(404).send('ANVISA Register not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get ANVISA registers
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetAnvisaRegistersParamsDTO;
        let {
            search,
            createdAfterDate,
            createdBeforeDate,
            rawMaterialId
        } = reqParams;

        const anvisaRegisters = await AnvisaRegister.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { invoiceCode: { [Op.like]: `%${search}%` } }
                    ]
                }),
                ...(createdAfterDate && { createdAt: { [Op.gte]: new Date(createdAfterDate) } }),
                ...(createdBeforeDate && { createdAt: { [Op.lte]: new Date(createdBeforeDate) } }),
                ...(rawMaterialId && { rawMaterialId })
            },
            include: [{
                model: RawMaterial,
                as: 'rawMaterial'
            },
            {
                model: Finished,
                as: 'finished',
            }
        ]});

        res.status(200).send(anvisaRegisters as AnvisaRegisterResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Create ANVISA register
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostAnvisaRegisterBodyDTO;

        const anvisaRegister = await AnvisaRegister.create(reqBody);
        res.status(200).send(anvisaRegister as AnvisaRegisterResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('ANVISA Register with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Update ANVISA register
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateAnvisaRegisterBodyDTO;

        // Search ANVISA register by id
        let anvisaRegister = await AnvisaRegister.findByPk(id);

        if (anvisaRegister) {
            anvisaRegister = await anvisaRegister.update(reqBody);

            res.status(200).send(anvisaRegister as AnvisaRegisterResponseDTO);
        } else res.status(404).send('ANVISA Register not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('ANVISA Register with provided info already exists!');
            else res.status(500).send(`${err.name} - ${err.message}`);
        } next(err);
    }
};

// Delete ANVISA register
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search ANVISA register by id
        const anvisaRegister = await AnvisaRegister.findByPk(id);
        if (anvisaRegister) {
            await anvisaRegister.destroy();

            res.status(200).send(`ANVISA Register with id ${id} deleted successfully!`);
        } else res.status(404).send('ANVISA Register not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}