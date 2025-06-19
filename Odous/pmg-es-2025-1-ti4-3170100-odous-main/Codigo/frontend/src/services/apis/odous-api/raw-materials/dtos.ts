import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";

export type GetRawMaterialsParamsDTO = BaseParamsDTO;

export interface PostRawMaterialBodyDTO {
    name: string;
    subtype?: string;
}

export interface UpdateRawMaterialPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
    body: {
        name?: string;
        subtype?: string;
    };
}

export interface DeleteRawMaterialPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
}

export interface RawMaterialResponseDTO extends BasePropertiesDTO {
    name: string;
    subtype?: string;
}