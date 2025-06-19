import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";

export interface PostRawMaterialBodyDTO {
    name: string;
    subtype?: string;
}

export interface UpdateRawMaterialBodyDTO {
    name?: string;
    subtype?: string;
}

export type GetRawMaterialsParamsDTO = BaseParamsDTO;

export interface RawMaterialResponseDTO extends BasePropertiesDTO {
    name: string;
    subtype?: string;
}