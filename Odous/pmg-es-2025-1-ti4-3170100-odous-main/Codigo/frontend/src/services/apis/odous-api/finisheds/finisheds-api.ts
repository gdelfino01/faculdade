import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetFinishedParamsDTO,
    GetFinishedsParamsDTO,
    PostFinishedBodyDTO,
    UpdateFinishedPayloadDTO,
    DeleteFinishedPayloadDTO,
    FinishedResponseDTO
} from "./dtos";

export default class FinishedsService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/finisheds`);
    }

    public getById(request: { id: string; params?: GetFinishedParamsDTO; }) {
        return this.client.get<FinishedResponseDTO, GetFinishedParamsDTO>(request.id);
    }

    public getBySKU(request: { sku: string; params?: GetFinishedParamsDTO; }) {
        return this.client.get<FinishedResponseDTO, GetFinishedParamsDTO>(`sku/${request.sku}`);
    }

    public get(request: { params?: GetFinishedsParamsDTO; }) {
        return this.client.get<FinishedResponseDTO[], GetFinishedsParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<FinishedResponseDTO, PostFinishedBodyDTO>({});
    }

    public putById() {
        return this.client.put<FinishedResponseDTO, UpdateFinishedPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteFinishedPayloadDTO>({ identifierKey: "id" });
    }
}