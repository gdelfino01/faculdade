import { MaterialResponseDTO } from "../materials/dtos";
import { SemifinishedFamilyResponseDTO } from "../semifinished-families/dtos";
import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";

export interface GetSemifinishedParamsDTO {
    includeRequiredMaterials?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
}

export interface GetSemifinishedsParamsDTO extends BaseParamsDTO {
    includeRequiredMaterials?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    familyId?: number;
}

export interface PostSemifinishedBodyDTO {
    sku: string;
    name: string;
    familyId: number; // in prod, substitute for `string` (UUID)
    requiredMaterials: SemifinishedMaterialShortDTO[];
}

export interface SemifinishedMaterialShortDTO {
    materialId: number; // in prod, substitute for `string` (UUID)
    requiredQuantity: number;
}

export interface UpdateSemifinishedPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
    body: {
        sku?: string;
        name?: string;
        familyId?: number; // in prod, substitute for `string` (UUID)
        requiredMaterials?: SemifinishedMaterialShortDTO[];
    }
}

export interface DeleteSemifinishedPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
}

export interface SemifinishedResponseDTO extends BasePropertiesDTO {
    sku: string;
    name: string;
    family: SemifinishedFamilyResponseDTO;
    stockQuantity: number;
    requiredMaterials?: (SemifinishedMaterialShortDTO | SemifinishedMaterialFullDTO)[];
}

export interface SemifinishedMaterialFullDTO {
    material: MaterialResponseDTO;
    requiredQuantity: number;
}