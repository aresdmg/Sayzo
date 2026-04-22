import { db } from "@/db"
import { cookies, headers } from "next/headers"
import jwt from "jsonwebtoken"

export interface SayzoJWTPayload {
    id: string,
    name: string,
    email: string,
    role: string,
    avatar: string
}

export const serverContext = async () => {
    const headersList = await headers()
    const authHeader = headersList.get("authorization")
    let token = authHeader?.split(" ")[1]

    if (!token) {
        const cs = await cookies()
        token = cs.get("sayzoAccessToken")?.value
    }

    let user: SayzoJWTPayload | null = null

    try {
        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error("JWT_SECRET not set")
        }

        if (token) {
            user = jwt.verify(token, secret) as SayzoJWTPayload
        } else {
            user = null
        }
    } catch (error) {
        console.error("JWT verification failed:", error)
        user = null
    }

    return {
        db,
        user
    }
}

export type ServerContext = Awaited<ReturnType<typeof serverContext>>