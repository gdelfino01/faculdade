import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetSemifinishedLotParamsDTO,
    GetSemifinishedLotsParamsDTO,
    PostSemifinishedLotBodyDTO,
    UpdateSemifinishedLotPayloadDTO,
    DeleteSemifinishedLotPayloadDTO,
    SemifinishedLotResponseDTO
} from "./dtos";

export default class SemifinishedLotsService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/semifinished-lots`);
    }

    public getById(request: { id: string; params?: GetSemifinishedLotParamsDTO; }) {
        return this.client.get<SemifinishedLotResponseDTO, GetSemifinishedLotParamsDTO>(request.id);
    }

    public getBySKU(request: { sku: string; params?: GetSemifinishedLotParamsDTO; }) {
        return this.client.get<SemifinishedLotResponseDTO, GetSemifinishedLotParamsDTO>(`sku/${request.sku}`);
    }

    public get(request: { params?: GetSemifinishedLotsParamsDTO; }) {
        return this.client.get<SemifinishedLotResponseDTO[], GetSemifinishedLotsParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<SemifinishedLotResponseDTO, PostSemifinishedLotBodyDTO>({});
    }

    public putById() {
        return this.client.put<SemifinishedLotResponseDTO, UpdateSemifinishedLotPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteSemifinishedLotPayloadDTO>({ identifierKey: "id" });
    }
}