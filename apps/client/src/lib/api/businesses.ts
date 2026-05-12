import { apiClient, ApiResponse } from "./client";
import { Business, CreateBusinessPayload } from "./types";

const businessesBasePath = "/api/v1/businesses";

export const businessesApi = {
    create(payload: CreateBusinessPayload) {
        return apiClient
            .post<ApiResponse<{ success: true }>>(businessesBasePath, payload)
            .then((res) => res.data);
    },

    delete(id: string) {
        return apiClient.delete<ApiResponse<Business>>(`${businessesBasePath}/${id}`).then((res) => res.data);
    },

    toggleActive(id: string) {
        return apiClient.put<ApiResponse<Business>>(`${businessesBasePath}/${id}`).then((res) => res.data);
    },

    listMine() {
        return apiClient.get<ApiResponse<Business[]>>(`${businessesBasePath}/my-businesses`).then((res) => res.data);
    },

    getById(id: string) {
        return apiClient.get<ApiResponse<Business>>(`${businessesBasePath}/${id}`).then((res) => res.data);
    },

    getBySlug(slug: string) {
        return apiClient.get<ApiResponse<Business>>(`${businessesBasePath}/slug/${slug}`).then((res) => res.data);
    },
};

