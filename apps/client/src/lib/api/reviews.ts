import { apiClient, ApiResponse } from "./client";
import { CreateReviewPayload, Review } from "./types";

const reviewsBasePath = "/api/v1/review";

export const reviewsApi = {
    create(payload: CreateReviewPayload) {
        return apiClient.post<ApiResponse<Review>>(reviewsBasePath, payload).then((res) => res.data);
    },
};

