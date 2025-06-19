import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetMaterialLotsParamsDTO,
    PostMaterialLotBodyDTO,
    UpdateMaterialLotPayloadDTO,
    DeleteMaterialLotPayloadDTO,
    MaterialLotResponseDTO
} from "./dtos";

export default class MaterialLotsService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/material-lots`);
    }

    public getById(request: { id: string; }) {
        return this.client.get<MaterialLotResponseDTO, undefined>(request.id);
    }

    public get(request: { params?: GetMaterialLotsParamsDTO; }) {
        return this.client.get<MaterialLotResponseDTO[], GetMaterialLotsParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<MaterialLotResponseDTO, PostMaterialLotBodyDTO>({});
    }

    public putById() {
        return this.client.put<MaterialLotResponseDTO, UpdateMaterialLotPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteMaterialLotPayloadDTO>({ identifierKey: "id" });
    }
}