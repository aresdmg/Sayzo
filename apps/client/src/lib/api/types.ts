export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: "USER" | "ADMIN";
    createdAt?: string;
    updatedAt?: string;
};

export type AuthUser = Pick<User, "id" | "name" | "email">;

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type Business = {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    reviewLink: string | null;
    createdAt: string;
};

export type CreateBusinessPayload = {
    name: string;
};

export type Review = {
    id: string;
    businessId: string;
    rating: number;
    content: string;
    fingerprint: string;
    language: "en" | "hi";
    createdAt: string;
};

export type CreateReviewPayload = {
    businessId: string;
    rating: number;
    content: string;
    fingerprint: string;
};
