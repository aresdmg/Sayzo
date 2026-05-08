import z from "zod";

export const createSchema = z.object({
    name: z.string().min(1).max(200)
})

export const byIdSchema = z.object({
    id: z.uuid()
})

export const bySlugSchema = z.object({
    slug: z.string()
})

export type Create = z.infer<typeof createSchema>
export type ById = z.infer<typeof byIdSchema>
export type BySlug = z.infer<typeof bySlugSchema>