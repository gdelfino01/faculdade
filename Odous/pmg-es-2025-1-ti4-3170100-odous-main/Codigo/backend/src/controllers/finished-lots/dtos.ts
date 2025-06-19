import { FinishedResponseDTO } from "../finisheds/dtos";
import { MaterialLotResponseDTO } from "../material-lots/dtos";
import { SemifinishedLotResponseDTO } from "../semifinished-lots/dtos";
import { FinishedProductionOrderResponseDTO } from "../finished-production-orders/dtos";

export interface GetFinishedLotParamsDTO {
    includeConsumedMaterialLots?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    includeConsumedSemifinishedLots?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
}

export interface GetFinishedLotsParamsDTO {
    search?: string;
    startedAfterDate?: string; // Date format
    endedBeforeDate?: string; // Date format
    includeConsumedMaterialLots?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    includeConsumedSemifinishedLots?: 'SHORT'| 'FULL' | 'NO'; // If absent, it'll be set to 'SHORT'
    finishedId?: number; // in prod, substitute for `string` (UUID)
    onlyAvailable?: boolean; // If absent, it'll be set to false - if set to true, only finished lots with availableQuantity > 0 will be returned
}

export interface PostFinishedLotBodyDTO {
    producedQuantityOK: number;
    producedQuantityNG: number;
    startDate?: Date;
    endDate?: Date;
    finishedId: number; // in prod, substitute for `string` (UUID)
    finishedProductionOrderId: number; // in prod, substitute for `string` (UUID)
    consumedMaterialLots: FinishedLotMaterialLotShortDTO[];
    consumedSemifinishedLots: FinishedLotSemifinishedLotShortDTO[];
}

export interface FinishedLotMaterialLotShortDTO {
    materialLotId: number; // in prod, substitute for `string` (UUID)
    consumedQuantity: number;
}

export interface FinishedLotSemifinishedLotShortDTO {
    semifinishedLotId: number; // in prod, substitute for `string` (UUID)
    consumedQuantity: number;
}

export interface UpdateFinishedLotBodyDTO {
    producedQuantityOK?: number;
    producedQuantityNG?: number;
    availableQuantity?: number;
    startDate?: Date;
    endDate?: Date;
    finishedId?: number; // in prod, substitute for `string` (UUID)
    finishedProductionOrderId?: number; // in prod, substitute for `string` (UUID)
    consumedMaterialLots?: FinishedLotMaterialLotShortDTO[];
    consumedSemifinishedLots?: FinishedLotSemifinishedLotShortDTO[];
}

export interface FinishedLotResponseDTO {
    id: number; // in prod, substitute for `string` (UUID)
    sku: string;
    producedQuantityOK: number;
    producedQuantityNG: number;
    availableQuantity: number;
    startDate?: Date;
    endDate?: Date;
    finished: FinishedResponseDTO;
    finishedProductionOrder?: FinishedProductionOrderResponseDTO;
    consumedMaterialLots?: (FinishedLotMaterialLotShortDTO | FinishedLotMaterialLotFullDTO)[];
    consumedSemifinishedLots?: (FinishedLotSemifinishedLotShortDTO | FinishedLotSemifinishedLotFullDTO)[];
}

export interface FinishedLotMaterialLotFullDTO {
    materialLot: MaterialLotResponseDTO;
    consumedQuantity: number;
}

export interface FinishedLotSemifinishedLotFullDTO {
    semifinishedLot: SemifinishedLotResponseDTO;
    consumedQuantity: number;
}