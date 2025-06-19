import express from 'express';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import User from '../../models/user';
import {
    PostUserBodyDTO,
    UpdateUserBodyDTO,
    UserResponseDTO,
    GetUsersParamsDTO,
    UserLoginBodyDTO
} from './dtos';

// Get user by id
export const getById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search user by id
        const user = await User.findByPk(id);

        if (user) res.status(200).send(user as UserResponseDTO);
        else res.status(404).send('User not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get user by email
export const getByEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const email = req.params.email;

        // Search user by email
        const user = await User.findOne({ where: { email } });

        if (user) res.status(200).send(user as UserResponseDTO);
        else res.status(404).send('User not found!');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Get users
export const get = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqParams = req.query as GetUsersParamsDTO;
        let {
            search,
            createdAfterDate,
            createdBeforeDate,
            role
        } = reqParams;

        const users = await User.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } },
                        { role: { [Op.like]: `%${search}%` } }
                    ]
                }),
                ...(createdAfterDate && { createdAt: { [Op.gte]: new Date(createdAfterDate) } }),
                ...(createdBeforeDate && { createdAt: { [Op.lte]: new Date(createdBeforeDate) } }),
                ...(role && { role })
            }
        });

        res.status(200).send(users as UserResponseDTO[]);

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Create user
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const reqBody = req.body as PostUserBodyDTO;

        const saltRounds = 10;
        reqBody.password = await bcrypt.hash(reqBody.password, saltRounds);

        const newUser = { ...reqBody };

        const user = await User.create(newUser);
        res.status(200).send(user as UserResponseDTO);

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('User with provided info already exists!');
            else if (err.name === 'SequelizeValidationError') {
                const passwordError = (err as any).errors && (err as any).errors.find((error: any) => error.path === 'password');
                if (passwordError) res.status(400).send("Password validation failed!");
                else res.status(500).send(`${err.name} - ${err.message}`);
            }
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Update user
export const updateById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;
        const reqBody = req.body as UpdateUserBodyDTO;

        // Search user by id
        let user = await User.findByPk(id);

        if (user) {
            if (reqBody.password) {
                const saltRounds = 10;
                reqBody.password = await bcrypt.hash(reqBody.password, saltRounds);
            }

            user = await user.update(reqBody);

            res.status(200).send(user as UserResponseDTO);
        } else res.status(404).send('User not found!');

    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'SequelizeUniqueConstraintError') res.status(400).send('User with provided info already exists!');
            else if (err.name === 'SequelizeValidationError') {
                const passwordError = (err as any).errors && (err as any).errors.find((error: any) => error.path === 'password');
                if (passwordError) res.status(400).send("Password validation failed!");
                else res.status(500).send(`${err.name} - ${err.message}`);
            }
            else res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};

// Delete user
export const deleteById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    try {
        const id = req.params.id;

        // Search user by id
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();

            res.status(200).send(`User with id ${id} deleted successfully!`);
        } else res.status(404).send('User not found!');

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
}

// Login
export const login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<void> => {
    const reqBody = req.body as UserLoginBodyDTO;
    try {
        const user = await User.findOne({ where: { email: reqBody.email } });
        if (!user) res.status(404).send('User not found!');
        else {
            const isPasswordValid = await bcrypt.compare(reqBody.password, user.password);

            if (!isPasswordValid) res.status(401).send('Incorrect password!');
            else res.status(200).send(user as UserResponseDTO);
        }

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`${err.name} - ${err.message}`);
        } else next(err);
    }
};