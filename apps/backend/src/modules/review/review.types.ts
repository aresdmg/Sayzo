import z from "zod"

const createSchema = z.object({
    businessId: z.string().min(1).max(100),
    rating: z.number(),
    content: z.string().min(1),
    fingerprint: z.string(),
})

export type CreateReview = z.infer<typeof createSchema>