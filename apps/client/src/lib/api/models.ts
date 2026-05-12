import { apiClient, ApiResponse } from "./client";
import { AuthUser, Business, CreateBusinessPayload, CreateReviewPayload, LoginPayload, RegisterPayload, Review, User } from "./types";

const usersBasePath = "/api/v1/users";
const businessesBasePath = "/api/v1/businesses";
const reviewsBasePath = "/api/v1/review";

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

export const businessesApi = {
    create(payload: CreateBusinessPayload) {
        return apiClient.post<ApiResponse<{ success: true }>>(businessesBasePath, payload).then((res) => res.data);
    },

    delete(id: string) {
        return apiClient.delete<ApiResponse<Business>>(`${businessesBasePath}/${id}`).then((res) => res.data);
    },

    toggleActive(id: string) {
        return apiClient.put<ApiResponse<Business>>(`${businessesBasePath}/${id}`).then((res) => res.data);
    },

    createReviewLink(id: string) {
        return apiClient.post<ApiResponse<Business>>(`${businessesBasePath}/review-link`, { id }).then((res) => res.data);
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

export const reviewsApi = {
    create(payload: CreateReviewPayload) {
        return apiClient.post<ApiResponse<Review>>(reviewsBasePath, payload).then((res) => res.data);
    },

    getByBusinessId(id: string) {
        return apiClient.get<ApiResponse<Review[]>>(`${reviewsBasePath}/business/${id}`).then((res) => res.data);
    },
};
