import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";

export interface GetUsersParamsDTO extends BaseParamsDTO {
    role?: 'admin' | 'operator'; // If absent, all roles will be returned
}

export interface PostUserBodyDTO {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'operator';
}

export interface UpdateUserPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
    body: {
        name?: string;
        email?: string;
        password?: string;
        role?: 'admin' | 'operator';
    };
}

export interface DeleteUserPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
}

export interface UserLoginBodyDTO {
    email: string;
    password: string;
}

export interface UserResponseDTO extends BasePropertiesDTO {
    name: string;
    email: string;
    role: 'admin' | 'operator';
}