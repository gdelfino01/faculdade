export interface BaseParamsDTO {
    search?: string;
    createdAfterDate?: string; // Date format
    createdBeforeDate?: string; // Date format
}

export interface BasePropertiesDTO {
    id: number; // in prod, substitute for `string` (UUID)
    createdAt: Date;
    updatedAt: Date;
}