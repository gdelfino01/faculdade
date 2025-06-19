import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetSemifinishedFamiliesParamsDTO,
    PostSemifinishedFamilyBodyDTO,
    UpdateSemifinishedFamilyPayloadDTO,
    DeleteSemifinishedFamilyPayloadDTO,
    SemifinishedFamilyResponseDTO
} from "./dtos";

export default class SemifinishedFamiliesService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/semifinished-families`);
    }

    public getById(request: { id: string; }) {
        return this.client.get<SemifinishedFamilyResponseDTO, undefined>(request.id);
    }

    public get(request: { params?: GetSemifinishedFamiliesParamsDTO; }) {
        return this.client.get<SemifinishedFamilyResponseDTO[], GetSemifinishedFamiliesParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<SemifinishedFamilyResponseDTO, PostSemifinishedFamilyBodyDTO>({});
    }

    public putById() {
        return this.client.put<SemifinishedFamilyResponseDTO, UpdateSemifinishedFamilyPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteSemifinishedFamilyPayloadDTO>({ identifierKey: "id" });
    }
}