import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Full Name cannot be empty").max(100, "Full Name should be less than 100 characters"),
    email: z.email().min(1, "Email cannot be empty").max(200, "Email should be less than 200 characters"),
    password: z.string().min(6, "Password must be 6 character long")
})

export const loginSchema = z.object({
    email: z.email().min(1, "Email cannot be empty").max(200, "Email should be less than 200 characters"),
    password: z.string().min(6, "Password must be 6 character long")
})

export type Register = z.infer<typeof registerSchema>
export type Login = z.infer<typeof loginSchema>