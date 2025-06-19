import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetFinishedProductionOrdersParamsDTO,
    PostFinishedProductionOrderBodyDTO,
    UpdateFinishedProductionOrderPayloadDTO,
    DeleteFinishedProductionOrderPayloadDTO,
    FinishedProductionOrderResponseDTO
} from "./dtos";

export default class FinishedProductionOrdersService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/finished-production-orders`);
    }

    public getById(request: { id: string; }) {
        return this.client.get<FinishedProductionOrderResponseDTO, undefined>(request.id);
    }

    public get(request: { params?: GetFinishedProductionOrdersParamsDTO; }) {
        return this.client.get<FinishedProductionOrderResponseDTO[], GetFinishedProductionOrdersParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<FinishedProductionOrderResponseDTO, PostFinishedProductionOrderBodyDTO>({});
    }

    public putById() {
        return this.client.put<FinishedProductionOrderResponseDTO, UpdateFinishedProductionOrderPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteFinishedProductionOrderPayloadDTO>({ identifierKey: "id" });
    }
}
