import z from "zod";

export const businessesSchema = z.object({
    name: z.string().min(1, "Business name cannot be empty").max(100, "Business name cannot be more than 100 characters")
})

export const businessByIdSchema = z.object({
    id: z.uuid()
})

export const businessBySlugSchema = z.object({
    slug: z.string().min(1, "Business slug is required")
})

export type BusinessById = z.infer<typeof businessByIdSchema>

export type Business = z.infer<typeof businessesSchema> 