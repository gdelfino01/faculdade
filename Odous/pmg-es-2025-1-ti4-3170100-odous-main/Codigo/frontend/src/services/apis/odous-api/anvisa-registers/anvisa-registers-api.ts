import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetAnvisaRegistersParamsDTO,
    PostAnvisaRegisterBodyDTO,
    UpdateAnvisaRegisterPayloadDTO,
    DeleteAnvisaRegisterPayloadDTO,
    AnvisaRegisterResponseDTO
} from "./dtos";

export default class AnvisaRegistersService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/anvisa-registers`);
    }

    public getById(request: { id: string; params?: undefined; }) {
        return this.client.get<AnvisaRegisterResponseDTO, undefined>(request.id);
    }

    public getByCodeNumber(request: { codeNumber: string; params?: undefined; }) {
        return this.client.get<AnvisaRegisterResponseDTO, undefined>(`code-number/${request.codeNumber}`);
    }

    public get(request: { params?: GetAnvisaRegistersParamsDTO; }) {
        return this.client.get<AnvisaRegisterResponseDTO[], GetAnvisaRegistersParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<AnvisaRegisterResponseDTO, PostAnvisaRegisterBodyDTO>({});
    }

    public putById() {
        return this.client.put<AnvisaRegisterResponseDTO, UpdateAnvisaRegisterPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<string, DeleteAnvisaRegisterPayloadDTO>({ identifierKey: "id" });
    }
}