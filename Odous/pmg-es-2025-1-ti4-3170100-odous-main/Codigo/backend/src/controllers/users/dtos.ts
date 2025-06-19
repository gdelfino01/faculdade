import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";

export interface PostUserBodyDTO {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'operator';
}

export interface UpdateUserBodyDTO {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'operator';
}

export interface UserResponseDTO extends BasePropertiesDTO {
    name: string;
    email: string;
    role: 'admin' | 'operator';
}

export interface GetUsersParamsDTO extends BaseParamsDTO {
    role?: 'admin' | 'operator'; // If absent, all roles will be returned
}

export interface UserLoginBodyDTO {
    email: string;
    password: string;
}