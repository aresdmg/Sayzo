import z from "zod";

export const createReviewSchema = z.object({
    businessId: z.uuid(),
    rating: z.int().min(1).max(5),
    content: z.string(),
    fingerprint: z.string()
})