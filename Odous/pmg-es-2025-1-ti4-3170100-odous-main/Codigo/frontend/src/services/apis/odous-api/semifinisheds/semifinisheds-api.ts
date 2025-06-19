import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetSemifinishedParamsDTO,
    GetSemifinishedsParamsDTO,
    PostSemifinishedBodyDTO,
    UpdateSemifinishedPayloadDTO,
    DeleteSemifinishedPayloadDTO,
    SemifinishedResponseDTO
} from "./dtos";

export default class SemifinishedsService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/semifinisheds`);
    }

    public getById(request: { id: string; params?: GetSemifinishedParamsDTO; }) {
        return this.client.get<SemifinishedResponseDTO, GetSemifinishedParamsDTO>(request.id);
    }

    public getBySKU(request: { sku: string; params?: GetSemifinishedParamsDTO; }) {
        return this.client.get<SemifinishedResponseDTO, GetSemifinishedParamsDTO>(`sku/${request.sku}`);
    }

    public get(request: { params?: GetSemifinishedsParamsDTO; }) {
        return this.client.get<SemifinishedResponseDTO[], GetSemifinishedsParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<SemifinishedResponseDTO, PostSemifinishedBodyDTO>({});
    }

    public putById() {
        return this.client.put<SemifinishedResponseDTO, UpdateSemifinishedPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteSemifinishedPayloadDTO>({ identifierKey: "id" });
    }
}