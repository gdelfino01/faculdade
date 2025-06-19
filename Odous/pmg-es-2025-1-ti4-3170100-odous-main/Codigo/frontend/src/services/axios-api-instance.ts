import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

function reactQuery<TData>(
    queryKey: unknown[],
    client: AxiosInstance,
    config: AxiosRequestConfig
) {
    return useQuery({
        queryKey,
        queryFn: async () => {
            try {
                const response = await client(config);
                return response.data as TData;
            } catch (error: any) {
                const customMessage = error?.response?.data;
                throw new Error(customMessage || error?.message || "Unknown error");
            }
        }
    });
}

interface MutationOptions<TVariables> {
    baseEndpoint: string;
    method: "post" | "put" | "delete";
    identifierKey?: keyof TVariables;
}

function reactMutation<TData, TVariables>(
    client: AxiosInstance,
    options: MutationOptions<TVariables>
) {
    return useMutation<TData, unknown, TVariables>({
        mutationFn: async (variables: TVariables) => {
            try {
                let { baseEndpoint, method, identifierKey } = options;

                let payload: any = { ...variables };

                if (identifierKey && payload[identifierKey] !== undefined) {
                    const identifierValue = payload[identifierKey];
                    baseEndpoint += `/${identifierValue}`;
                    delete payload[identifierKey];
                }

                if (payload.body !== undefined) payload = payload.body;

                const config: AxiosRequestConfig = { url: baseEndpoint, method };
                if (method === "delete") config.params = payload;
                else config.data = payload;

                const response = await client(config);
                return response.data as TData;
            } catch (error: any) {
                const customMessage = error?.response?.data;
                throw new Error(customMessage || error?.message || "Unknown error");
            }
        }
    });
}

export default class AxiosApiInstance {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({ baseURL });
    }

    public getClientBaseUrl(): string {
        return this.client.defaults.baseURL ?? "";
    }

    public get<TData, TParams>(url: string, params?: TParams) {
        const config: AxiosRequestConfig = { url, method: "get", params };
        const queryKey = [this.getClientBaseUrl(), url, params];
        return reactQuery<TData>(queryKey, this.client, config);
    }

    public post<TData, TVariables>(req: { url?: string }) {
        return reactMutation<TData, TVariables>(this.client, {
            baseEndpoint: req.url ?? "",
            method: "post"
        });
    }

    public put<TData, TVariables>(req: { url?: string, identifierKey?: keyof TVariables }) {
        return reactMutation<TData, TVariables>(this.client, {
            baseEndpoint: req.url ?? "",
            method: "put",
            identifierKey: req.identifierKey
        });
    }

    public delete<TData, TVariables>(req: { url?: string, identifierKey?: keyof TVariables }) {
        return reactMutation<TData, TVariables>(this.client, {
            baseEndpoint: req.url ?? "",
            method: "delete",
            identifierKey: req.identifierKey
        });
    }
}