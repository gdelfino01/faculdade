import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetFinishedLotParamsDTO,
    GetFinishedLotsParamsDTO,
    PostFinishedLotBodyDTO,
    UpdateFinishedLotPayloadDTO,
    DeleteFinishedLotPayloadDTO,
    FinishedLotResponseDTO
} from "./dtos";

export default class FinishedLotsService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/finished-lots`);
    }

    public getById(request: { id: string; params?: GetFinishedLotParamsDTO; }) {
        return this.client.get<FinishedLotResponseDTO, GetFinishedLotParamsDTO>(request.id);
    }

    public getBySKU(request: { sku: string; params?: GetFinishedLotParamsDTO; }) {
        return this.client.get<FinishedLotResponseDTO, GetFinishedLotParamsDTO>(`sku/${request.sku}`);
    }

    public get(request: { params?: GetFinishedLotsParamsDTO; }) {
        return this.client.get<FinishedLotResponseDTO[], GetFinishedLotsParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<FinishedLotResponseDTO, PostFinishedLotBodyDTO>({});
    }

    public putById() {
        return this.client.put<FinishedLotResponseDTO, UpdateFinishedLotPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteFinishedLotPayloadDTO>({ identifierKey: "id" });
    }
}