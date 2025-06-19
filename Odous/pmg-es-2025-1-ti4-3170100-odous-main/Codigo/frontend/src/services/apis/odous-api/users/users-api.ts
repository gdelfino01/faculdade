import AxiosApiInstance from "../../../axios-api-instance";
import {
    GetUsersParamsDTO,
    PostUserBodyDTO,
    UpdateUserPayloadDTO,
    DeleteUserPayloadDTO,
    UserLoginBodyDTO,
    UserResponseDTO
} from "./dtos";

export default class UsersService {
    private readonly client: AxiosApiInstance;

    constructor(client: AxiosApiInstance) {
        this.client = new AxiosApiInstance(`${client.getClientBaseUrl()}/users`);
    }

    public getById(request: { id: string; }) {
        return this.client.get<UserResponseDTO, undefined>(request.id);
    }

    public get(request: { params?: GetUsersParamsDTO; }) {
        return this.client.get<UserResponseDTO[], GetUsersParamsDTO>("", request.params);
    }

    public post() {
        return this.client.post<UserResponseDTO, PostUserBodyDTO>({});
    }

    public putById() {
        return this.client.put<UserResponseDTO, UpdateUserPayloadDTO>({ identifierKey: "id" });
    }

    public deleteById() {
        return this.client.delete<UserResponseDTO, DeleteUserPayloadDTO>({ identifierKey: "id" });
    }

    public login() {
        return this.client.post<string, UserLoginBodyDTO>({ url: "login" });
    }
}