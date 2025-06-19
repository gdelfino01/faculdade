import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";

export interface PostSemifinishedFamilyBodyDTO {
    name: string;
    shortName: string;
}

export interface UpdateSemifinishedFamilyBodyDTO {
    name?: string;
    shortName?: string;
}

export type GetSemifinishedFamiliesParamsDTO = BaseParamsDTO;

export interface SemifinishedFamilyResponseDTO extends BasePropertiesDTO {
    name: string;
    shortName: string;
}