import { FastifyReply, FastifyRequest } from "fastify";
import { Login, Register } from "./user.types";
import { users, userToken } from "@repo/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"
import crypto from "node:crypto";
import { hashToken } from "../../utils/hash-token";
import { AppError } from "../../utils/payload";


export const registerUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const { name, email, password } = req.body as Register
    if (!name || !email || !password) {
        throw new AppError("Missing information", 400)
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
        throw new AppError("Email is taken", 400)
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
        // return Response.error(reply, "Failed to create user", 500)
        throw new AppError("User creation failed", 500)
    }

    return Response.success(reply, createdUser, "User created", 201)
}

export const loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const app = req.server
    const db = req.server.db

    const { email, password } = req.body as Login
    if (!email || !password) {
        return Response.error(reply, "Missing information", 400)
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
            return Response.error(reply, "User not found", 404)
        }

        const isValidPass = await bcrypt.compare(password, user.password!)
        if (!isValidPass) {
            return Response.error(reply, "Invalid credentials", 400)
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