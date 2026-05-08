import { FastifyReply, FastifyRequest } from "fastify";
import { Login, Register } from "./user.types.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"
import crypto from "node:crypto";
import { hashToken } from "../../utils/hash-token.js";
import { ApiError, ApiResponse } from "../../utils/payload.js";
import { users, userToken } from "../../db/schema.js";


export const registerUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const { name, email, password } = req.body as Register
    if (!name || !email || !password) {
        throw new ApiError("Missing information", 400)
    }

    const [exitingUser] = await db
        .select({
            id: users.id,
            name: users.name
        })
        .from(users)
        .where(
            eq(users.email, email)
        )
        .limit(1)

    if (exitingUser) {
        throw new ApiError("Email is taken", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [createdUser] = await db
        .insert(users)
        .values({
            email,
            name,
            password: hashedPassword
        })
        .returning()

    if (!createdUser) {
        throw new ApiError("User creation failed", 500)
    }

    return reply.status(201).send(
        new ApiResponse("User created", 201, createdUser)
    )
}

export const loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server
    const db = req.server.db

    const { email, password } = req.body as Login
    if (!email || !password) {
        throw new ApiError("Missing information", 400)
    }

    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                password: users.password,
                role: users.role
            })
            .from(users)
            .where(
                eq(users.email, email)
            )
            .limit(1)

        if (!user) {
            throw new ApiError("User not found", 404)
        }

        const isValidPass = await bcrypt.compare(password, user.password!)
        if (!isValidPass) {
            throw new ApiError("Invalid credentials", 400)
        }

        const accessToken = app.jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        )

        const refreshToken = crypto.randomBytes(64).toString("hex")
        const hashedRefreshToken = hashToken(refreshToken)

        await tx.insert(userToken).values({
            userId: user.id,
            refreshToken: hashedRefreshToken,
            expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })

        return reply
            .status(200)
            .setCookie("sayzo_access_token", accessToken, { secure: true, path: "/", sameSite: "lax", maxAge: 1000 * 60 * 15 })
            .setCookie("sayzo_refresh_token", refreshToken, { secure: true, path: "/", sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 30 })
    })
}