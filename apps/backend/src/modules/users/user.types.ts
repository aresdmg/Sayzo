import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.email(),
    password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(100),
})

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>