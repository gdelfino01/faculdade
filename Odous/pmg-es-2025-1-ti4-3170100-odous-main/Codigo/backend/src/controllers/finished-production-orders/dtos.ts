import { FinishedLotResponseDTO } from "../finished-lots/dtos";

export interface GetFinishedProductionOrdersParamsDTO {
    search?: string;
    issuedAfterDate?: string; // Date format
    issuedBeforeDate?: string; // Date format
    finishedId?: number; // in prod, substitute for `string` (UUID)
    status?: 'ISSUED' | 'STARTED' | 'FINISHED' | 'CANCELED'; // if absent, all statuses will be returned
}

export interface PostFinishedProductionOrderBodyDTO {
    goalQuantity: number;
    issueDate?: Date;
    details?: string;
    finishedId: number; // in prod, substitute for `string` (UUID)
}

export interface UpdateFinishedProductionOrderBodyDTO {
    status?: 'ISSUED' | 'STARTED' | 'FINISHED' | 'CANCELED';
    goalQuantity?: number;
    issueDate?: Date;
    details?: string;
    finishedId?: number; // in prod, substitute for `string` (UUID)
    finishedLotId?: number; // in prod, substitute for `string` (UUID)
}

export interface FinishedProductionOrderResponseDTO {
    id: number; // in prod, substitute for `string` (UUID)
    status: 'ISSUED' | 'STARTED' | 'FINISHED' | 'CANCELED';
    goalQuantity: number;
    issueDate?: Date;
    details?: string;
    finishedId: number; // in prod, substitute for `string` (UUID)
    finishedLot?: FinishedLotResponseDTO;
}