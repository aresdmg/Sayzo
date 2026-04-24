import z from "zod";

export const businessesSchema = z.object({
    ownerId: z.uuid().optional(),
    name: z.string().min(1, "Business name cannot be empty").max(100, "Business name cannot be more than 100 characters")
})

export const businessByIdSchema = z.object({
    id: z.uuid()
})

export type BusinessById = z.infer<typeof businessByIdSchema>

export type Business = z.infer<typeof businessesSchema> 