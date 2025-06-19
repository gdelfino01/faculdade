import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetSemifinishedProductionOrdersParamsDTO,
    PostSemifinishedProductionOrderBodyDTO,
    UpdateSemifinishedProductionOrderPayloadDTO,
    DeleteSemifinishedProductionOrderPayloadDTO,
    SemifinishedProductionOrderResponseDTO
} from "./dtos";

export default class SemifinishedProductionOrdersService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/semifinished-production-orders`);
    }

    public getById(request: { id: string; }) {
        return this.client.get<SemifinishedProductionOrderResponseDTO, undefined>(request.id);
    }

    public get(request: { params?: GetSemifinishedProductionOrdersParamsDTO; }) {
        return this.client.get<SemifinishedProductionOrderResponseDTO[], GetSemifinishedProductionOrdersParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<SemifinishedProductionOrderResponseDTO, PostSemifinishedProductionOrderBodyDTO>({});
    }

    public putById() {
        return this.client.put<SemifinishedProductionOrderResponseDTO, UpdateSemifinishedProductionOrderPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteSemifinishedProductionOrderPayloadDTO>({ identifierKey: "id" });
    }
}
