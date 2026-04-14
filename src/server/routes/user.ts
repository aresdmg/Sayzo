import { loginSchema, registerSchema } from "@/types/auth";
import { publicProcedure, router } from "../trpc";
import { users, userToken } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const userRoutes = router({
    registerUser: publicProcedure
        .input(registerSchema)
        .mutation(
            async ({ input, ctx }) => {
                const { name, email, password } = input
                if (!name || !email || !password) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "missing fields" })
                }

                const [existingEmail] = await ctx.db
                    .select({
                        id: users.id,
                        name: users.name
                    })
                    .from(users)
                    .where(
                        eq(users.email, email)
                    )
                    .limit(1)

                if (existingEmail) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "email is taken" })
                }

                const hashedPassword = await bcrypt.hash(password, 12)
                const [createdUser] = await ctx.db
                    .insert(users)
                    .values({
                        name,
                        email,
                        password: hashedPassword
                    })
                    .returning()

                if (!createdUser) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "failed to register user" })
                }

                return {
                    ...createdUser,
                    password: undefined,
                    deletedAt: undefined,
                    updatedAt: undefined,
                    role: undefined
                }
            }
        ),

    loginUser: publicProcedure
        .input(loginSchema)
        .mutation(
            async ({ ctx, input }) => {
                const { email, password } = input
                if (!email || !password) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "email or password is missing" })
                }

                const accessSecret = process.env.ACCESS_SECRET
                if (!accessSecret) {
                    throw new Error("ACCESS_SECRET is not set")
                }

                return await ctx.db.transaction(async (tx) => {
                    const [user] = await tx
                        .select({
                            id: users.id,
                            name: users.name,
                            email: users.email,
                            role: users.role,
                            password: users.password
                        })
                        .from(users)
                        .where(
                            and(
                                eq(users.email, email),
                                eq(users.role, "USER")
                            )
                        )
                        .limit(1)

                    if (!user) {
                        throw new TRPCError({ code: "NOT_FOUND", message: "user not found" })
                    }

                    const isValidPassword = await bcrypt.compare(password, user.password!)
                    if (!isValidPassword) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "invalid credentials" })
                    }

                    const accessToken = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role
                        },
                        accessSecret,
                        {
                            expiresIn: "15m"
                        }
                    )

                    const refreshToken = crypto.randomBytes(64).toString("hex")
                    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest("hex")

                    tx.insert(userToken)
                        .values({
                            userId: user.id,
                            refreshToken: hashedRefreshToken,
                            expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                        })

                    const cs = await cookies()
                    cs.set("sayzo_accessToken", accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 15,
                    });

                    cs.set("sayzo_refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 7,
                    });

                    return { success: true }
                })
            }
        ),
})