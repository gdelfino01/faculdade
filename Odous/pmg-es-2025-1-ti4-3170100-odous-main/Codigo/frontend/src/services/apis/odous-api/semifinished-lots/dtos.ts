import { SemifinishedResponseDTO } from "../semifinisheds/dtos";
import { MaterialLotResponseDTO } from "../material-lots/dtos";
import { SemifinishedProductionOrderResponseDTO } from "../semifinished-production-orders/dtos";

export interface GetSemifinishedLotParamsDTO {
    includeConsumedMaterialLots?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
}

export interface GetSemifinishedLotsParamsDTO {
    search?: string;
    startedAfterDate?: string; // Date format
    endedBeforeDate?: string; // Date format
    includeConsumedMaterialLots?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    semifinishedId?: number; // in prod, substitute for `string` (UUID)
    onlyAvailable?: boolean; // If absent, it'll be set to false - if set to true, only semifinished lots with availableQuantity > 0 will be returned
}

export interface PostSemifinishedLotBodyDTO {
    producedQuantityOK: number;
    producedQuantityNG: number;
    startDate?: Date;
    endDate?: Date;
    semifinishedId: number; // in prod, substitute for `string` (UUID)
    semifinishedProductionOrderId: number; // in prod, substitute for `string` (UUID)
    consumedMaterialLots: SemifinishedLotMaterialLotShortDTO[];
}

export interface SemifinishedLotMaterialLotShortDTO {
    materialLotId: number; // in prod, substitute for `string` (UUID)
    consumedQuantity: number;
}

export interface UpdateSemifinishedLotPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
    body: {
        producedQuantityOK?: number;
        producedQuantityNG?: number;
        availableQuantity?: number;
        startDate?: Date;
        endDate?: Date;
        semifinishedId?: number; // in prod, substitute for `string` (UUID)
        semifinishedProductionOrderId?: number; // in prod, substitute for `string` (UUID)
        consumedMaterialLots?: SemifinishedLotMaterialLotShortDTO[];
    }
}

export interface DeleteSemifinishedLotPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
}

export interface SemifinishedLotResponseDTO {
    id: number; // in prod, substitute for `string` (UUID)
    sku: string;
    producedQuantityOK: number;
    producedQuantityNG: number;
    availableQuantity: number;
    startDate?: Date;
    endDate?: Date;
    semifinished: SemifinishedResponseDTO;
    semifinishedProductionOrder?: SemifinishedProductionOrderResponseDTO;
    consumedMaterialLots?: (SemifinishedLotMaterialLotShortDTO | SemifinishedLotMaterialLotFullDTO)[];
}

export interface SemifinishedLotMaterialLotFullDTO {
    materialLot: MaterialLotResponseDTO;
    consumedQuantity: number;
}