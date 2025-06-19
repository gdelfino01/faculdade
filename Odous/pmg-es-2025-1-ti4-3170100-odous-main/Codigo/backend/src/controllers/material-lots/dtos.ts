import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";
import { MaterialResponseDTO } from "../materials/dtos";

export interface PostMaterialLotBodyDTO {
    invoiceCode: string;
    acquiredQuantity: number;
    materialId: number; // in prod, substitute for `string` (UUID)
}

export interface UpdateMaterialLotBodyDTO {
    invoiceCode?: string;
    acquiredQuantity?: number;
    availableQuantity?: number;
    materialId?: number; // in prod, substitute for `string` (UUID)
}

export interface GetMaterialLotsParamsDTO extends BaseParamsDTO {
    materialId?: number; // in prod, substitute for `string` (UUID)
    invoiceCode?: string;
    onlyAvailable?: boolean; // If absent, it'll be set to false - if set to true, only material lots with availableQuantity > 0 will be returned
}

export interface MaterialLotResponseDTO extends BasePropertiesDTO {
    invoiceCode: string;
    acquiredQuantity: number;
    availableQuantity: number;
    material?: MaterialResponseDTO;
}