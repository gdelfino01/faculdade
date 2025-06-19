import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetRawMaterialsParamsDTO,
    PostRawMaterialBodyDTO,
    UpdateRawMaterialPayloadDTO,
    DeleteRawMaterialPayloadDTO,
    RawMaterialResponseDTO
} from "./dtos";

export default class RawMaterialsService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/raw-materials`);
    }

    public getById(request: { id: string; }) {
        return this.client.get<RawMaterialResponseDTO, undefined>(request.id);
    }

    public get(request: { params?: GetRawMaterialsParamsDTO; }) {
        return this.client.get<RawMaterialResponseDTO[], GetRawMaterialsParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<RawMaterialResponseDTO, PostRawMaterialBodyDTO>({});
    }

    public putById() {
        return this.client.put<RawMaterialResponseDTO, UpdateRawMaterialPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteRawMaterialPayloadDTO>({ identifierKey: "id" });
    }
}