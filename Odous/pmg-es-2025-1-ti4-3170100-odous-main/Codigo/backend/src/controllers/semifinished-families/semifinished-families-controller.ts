import express from 'express';
import { Op } from 'sequelize';

import SemifinishedFamily from '../../models/semifinished-family';

import {
    PostSemifinishedFamilyBodyDTO,
    UpdateSemifinishedFamilyBodyDTO,
    GetSemifinishedFamiliesParamsDTO,
    SemifinishedFamilyResponseDTO
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
        const semifinishedFamily = await SemifinishedFamily.findByPk(id);

        if (semifinishedFamily) res.status(200).send(semifinishedFamily as SemifinishedFamilyResponseDTO);
        else res.status(404).send('Semifinished family not found!');
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
        const reqParams = req.query as GetSemifinishedFamiliesParamsDTO;
        let {
            search,
            createdAfterDate,
            createdBeforeDate
        } = reqParams;

        const semifinishedFamilies = await SemifinishedFamily.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { shortName: { [Op.like]: `%${search}%` } }
                    ]
                }),
                ...(createdAfterDate && { createdAt: { [Op.gte]: new Date(createdAfterDate) } }),
                ...(createdBeforeDate && { createdAt: { [Op.lte]: new Date(createdBeforeDate) } })
            }
        });

        res.status(200).send(semifinishedFamilies as SemifinishedFamilyResponseDTO[]);

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
        const reqBody = req.body as PostSemifinishedFamilyBodyDTO;

        const semifinishedFamily = await SemifinishedFamily.create(reqBody);
        res.status(200).send(semifinishedFamily as SemifinishedFamilyResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished family with provided info already exists!');
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
        const reqBody = req.body as UpdateSemifinishedFamilyBodyDTO;

        // Search raw material by id
        let semifinishedFamily = await SemifinishedFamily.findByPk(id);

        if (semifinishedFamily) {
            semifinishedFamily = await semifinishedFamily.update(reqBody);

            res.status(200).send(semifinishedFamily as SemifinishedFamilyResponseDTO);
        } else res.status(404).send('Semifinished family not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('Semifinished family with provided info already exists!');
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
        const semifinishedFamily = await SemifinishedFamily.findByPk(id);
        if (semifinishedFamily) {
            await semifinishedFamily.destroy();

            res.status(200).send(`Semifinished family with id ${id} deleted successfully!`);
        } else res.status(404).send('Semifinished family not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}