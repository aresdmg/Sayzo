import { apiClient, ApiResponse } from "./client";
import { AuthUser, LoginPayload, RegisterPayload, User } from "./types";

const usersBasePath = "/api/v1/users";

export const usersApi = {
    register(payload: RegisterPayload) {
        return apiClient.post<ApiResponse<User>>(usersBasePath, payload).then((res) => res.data);
    },

    login(payload: LoginPayload) {
        return apiClient.post<ApiResponse<null>>(`${usersBasePath}/login`, payload).then((res) => res.data);
    },

    logout() {
        return apiClient.post<void>(`${usersBasePath}/logout`).then((res) => res.data);
    },

    me() {
        return apiClient.get<ApiResponse<AuthUser>>(usersBasePath).then((res) => res.data);
    },
};

