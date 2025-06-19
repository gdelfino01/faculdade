import { SemifinishedLotResponseDTO } from "../semifinished-lots/dtos";

export interface GetSemifinishedProductionOrdersParamsDTO {
    search?: string;
    issuedAfterDate?: string; // Date format
    issuedBeforeDate?: string; // Date format
    semifinishedId?: number; // in prod, substitute for `string` (UUID)
    status?: 'ISSUED' | 'STARTED' | 'FINISHED' | 'CANCELED'; // if absent, all statuses will be returned
}

export interface PostSemifinishedProductionOrderBodyDTO {
    goalQuantity: number;
    issueDate?: Date;
    details?: string;
    semifinishedId: number; // in prod, substitute for `string` (UUID)
}

export interface UpdateSemifinishedProductionOrderBodyDTO {
    status?: 'ISSUED' | 'STARTED' | 'FINISHED' | 'CANCELED';
    goalQuantity?: number;
    issueDate?: Date;
    details?: string;
    semifinishedId?: number; // in prod, substitute for `string` (UUID)
    semifinishedLotId?: number; // in prod, substitute for `string` (UUID)
}

export interface SemifinishedProductionOrderResponseDTO {
    id: number; // in prod, substitute for `string` (UUID)
    status: 'ISSUED' | 'STARTED' | 'FINISHED' | 'CANCELED';
    goalQuantity: number;
    issueDate?: Date;
    details?: string;
    semifinishedId: number; // in prod, substitute for `string` (UUID)
    semifinishedLot?: SemifinishedLotResponseDTO;
}