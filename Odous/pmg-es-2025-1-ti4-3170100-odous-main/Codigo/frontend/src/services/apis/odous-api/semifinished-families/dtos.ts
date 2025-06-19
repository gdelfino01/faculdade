import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";

export interface PostSemifinishedFamilyBodyDTO {
    name: string;
    shortName: string;
}

export interface UpdateSemifinishedFamilyPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
    body: {
        name?: string;
        shortName?: string;
    }
}

export type GetSemifinishedFamiliesParamsDTO = BaseParamsDTO;

export interface DeleteSemifinishedFamilyPayloadDTO {
    id: number; // in prod, substitute for `string` (UUID)
}

export interface SemifinishedFamilyResponseDTO extends BasePropertiesDTO {
    name: string;
    shortName: string;
}