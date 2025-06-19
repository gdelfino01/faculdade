import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";
import { RawMaterialResponseDTO } from "../raw-materials/dtos";

export interface PostMaterialBodyDTO {
    sku: string;
    name: string;
    measurementUnit: string;
    rawMaterialId: number; // in prod, substitute for `string` (UUID)
}

export interface UpdateMaterialBodyDTO {
    sku?: string;
    name?: string;
    measurementUnit?: string;
    rawMaterialId?: number; // in prod, substitute for `string` (UUID)
}

export interface GetMaterialsParamsDTO extends BaseParamsDTO {
    measurementUnits?: string[]; // If absent, all measurement units will be returned
    rawMaterialId?: number;
}

export interface MaterialResponseDTO extends BasePropertiesDTO {
    sku: string;
    name: string;
    measurementUnit: string;
    stockQuantity: number;
    rawMaterial?: RawMaterialResponseDTO;
}