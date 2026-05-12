import axios, { AxiosError } from "axios";

export type ApiResponse<T = unknown> = {
    success: boolean;
    message: string;
    statusCode: number;
    data?: T;
};

export type ApiErrorPayload = {
    message?: string;
    statusCode?: number;
    errors?: unknown;
};

export class ApiRequestError extends Error {
    statusCode?: number;
    errors?: unknown;

    constructor(message: string, statusCode?: number, errors?: unknown) {
        super(message);
        this.name = "ApiRequestError";
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.request.use((config) => {
    config.headers.set("Accept", "application/json");
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorPayload>) => {
        const payload = error.response?.data;
        const message = payload?.message ?? error.message ?? "Request failed";

        return Promise.reject(
            new ApiRequestError(message, payload?.statusCode ?? error.response?.status, payload?.errors),
        );
    },
)
