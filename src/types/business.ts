import z from "zod";

export const businessesSchema = z.object({
    ownerId: z.uuid().nonempty(),
    name: z.string().min(1, "Business name cannot be empty").max(100, "Business name cannot be more than 100 characters")
})

export type Business = z.infer<typeof businessesSchema> 