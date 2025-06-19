import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";
import { MaterialResponseDTO } from "../materials/dtos";
import { SemifinishedResponseDTO } from "../semifinisheds/dtos";
import { AnvisaRegisterResponseDTO } from "../anvisa-registers/dtos";

export interface GetFinishedParamsDTO {
    includeRequiredMaterials?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    includeRequiredSemifinisheds?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
}

export interface GetFinishedsParamsDTO extends BaseParamsDTO {
    includeRequiredMaterials?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    includeRequiredSemifinisheds?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    rawMaterialId?: number; // in prod, substitute for `string` (UUID)
}

export interface PostFinishedBodyDTO {
    sku: string;
    name: string;
    price: number;
    requiredMaterials: FinishedMaterialShortDTO[];
    requiredSemifinisheds: FinishedSemifinishedShortDTO[];
}

export interface FinishedMaterialShortDTO {
    materialId: number; // in prod, substitute for `string` (UUID)
    requiredQuantity: number;
}

export interface FinishedSemifinishedShortDTO {
    semifinishedId: number; // in prod, substitute for `string` (UUID)
    requiredQuantity: number;
}

export interface UpdateFinishedPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
    body: {
        sku?: string;
        name?: string;
        price?: number;
        requiredMaterials?: FinishedMaterialShortDTO[];
        requiredSemifinisheds?: FinishedSemifinishedShortDTO[];
    };
}

export interface DeleteFinishedPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
}

export interface FinishedResponseDTO extends BasePropertiesDTO {
    sku: string;
    name: string;
    price: number;
    stockQuantity: number;
    anvisaRegister?: AnvisaRegisterResponseDTO;
    requiredMaterials?: (FinishedMaterialShortDTO | FinishedMaterialFullDTO)[];
    requiredSemifinisheds?: (FinishedSemifinishedShortDTO | FinishedSemifinishedFullDTO)[];
}

export interface FinishedMaterialFullDTO {
    material: MaterialResponseDTO;
    requiredQuantity: number;
}

export interface FinishedSemifinishedFullDTO {
    semifinished: SemifinishedResponseDTO;
    requiredQuantity: number;
}