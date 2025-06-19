import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetMaterialsParamsDTO,
    PostMaterialBodyDTO,
    UpdateMaterialPayloadDTO,
    DeleteMaterialPayloadDTO,
    MaterialResponseDTO
} from "./dtos";

export default class MaterialsService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/materials`);
    }

    public getById(request: { id: string; }) {
        return this.client.get<MaterialResponseDTO, undefined>(request.id);
    }

    public getBySKU(request: { sku: string; }) {
        return this.client.get<MaterialResponseDTO, undefined>(`sku/${request.sku}`);
    }

    public get(request: { params?: GetMaterialsParamsDTO; }) {
        return this.client.get<MaterialResponseDTO[], GetMaterialsParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<MaterialResponseDTO, PostMaterialBodyDTO>({});
    }

    public putById() {
        return this.client.put<MaterialResponseDTO, UpdateMaterialPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteMaterialPayloadDTO>({ identifierKey: "id" });
    }
}