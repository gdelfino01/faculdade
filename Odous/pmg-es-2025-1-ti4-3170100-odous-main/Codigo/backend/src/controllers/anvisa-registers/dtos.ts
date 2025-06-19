import { BaseParamsDTO, BasePropertiesDTO } from "../utils/dtos";
import { RawMaterialResponseDTO } from "../raw-materials/dtos";
import { FinishedResponseDTO } from "../finisheds/dtos";

export interface GetAnvisaRegistersParamsDTO extends BaseParamsDTO {
    rawMaterialId?: number;
}

export interface PostAnvisaRegisterBodyDTO {
    codeNumber: string;
    family: string;
    rawMaterialId: number; // in prod, substitute for `string` (UUID)
    finishedId: number; // in prod, substitute for `string` (UUID)
}

export interface UpdateAnvisaRegisterBodyDTO {
    codeNumber?: string;
    family?: string;
    rawMaterialId?: number; // in prod, substitute for `string` (UUID)
    finishedId?: number; // in prod, substitute for `string` (UUID)
}

export interface AnvisaRegisterResponseDTO extends BasePropertiesDTO {
    codeNumber: string;
    family: string;
    rawMaterial?: RawMaterialResponseDTO;
    finished?: FinishedResponseDTO;
}