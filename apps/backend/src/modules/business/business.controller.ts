import { FastifyReply, FastifyRequest } from "fastify";
import { JWTPayloadType } from "../../plugin/auth.js";
import { ApiError, ApiResponse } from "../../utils/payload.js";
import { ById, BySlug, Create } from "./business.types.js";
import { makeSlug } from "../../utils/slug.js";
import { businesses, users } from "../../db/schema.js";
import { and, eq } from "drizzle-orm";

export const createBusiness = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const JWTUser = req.user as JWTPayloadType
    if (!JWTUser) {
        throw new ApiError("Unauthorized", 401)
    }

    const { name } = req.body as Create
    if (!name) {
        throw new ApiError("Business name is required", 400)
    }

    const generatedSlug = makeSlug(name)

    const [existingBusiness] = await db
        .select({
            id: businesses.id,
            name: businesses.name,
            ownerId: businesses.ownerId
        })
        .from(businesses)
        .where(
            eq(businesses.slug, generatedSlug),
        )
        .limit(1)

    if (existingBusiness) {
        throw new ApiError("Business exists")
    }

    return await db.transaction(async (tx) => {
        const [user] = await tx
            .select({
                id: users.id
            })
            .from(users)
            .where(
                and(
                    eq(users.email, JWTUser.email),
                    eq(users.id, JWTUser.id)
                )
            )
            .limit(1)

        if (!user) throw new ApiError("User not found");

        const [createdBusiness] = await tx
            .insert(businesses)
            .values({
                name,
                ownerId: user.id,
                slug: generatedSlug
            })
            .returning()

        if (!createdBusiness) throw new ApiError("Business creation failed", 500);

        return reply.status(200).send(
            new ApiResponse("Business created", 200, { success: true })
        )
    })
}

export const deleteBusiness = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const JWTUser = req.user as JWTPayloadType
    if (!JWTUser) {
        throw new ApiError("Unauthorized", 401)
    }

    const { id } = req.params as ById
    if (!id) {
        throw new ApiError("Business id is required")
    }

    const [business] = await db
        .select({
            id: businesses.id,
            name: businesses.name
        })
        .from(businesses)
        .where(
            and(
                eq(businesses.id, id),
                eq(businesses.ownerId, JWTUser.id)
            )
        )
        .limit(1)

    if (!business) {
        throw new ApiError("Business not found", 404)
    }

    const [deletedBusinesses] = await db
        .delete(businesses)
        .where(
            and(
                eq(businesses.id, id),
                eq(businesses.ownerId, JWTUser.id)
            )
        )
        .returning()

    if (!deletedBusinesses) {
        throw new ApiError("Business deletion failed", 400)
    }

    return reply.status(200).send(
        new ApiResponse("Business deleted", 200, deletedBusinesses)
    )
}

export const toggleActive = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const JWTUser = req.user as JWTPayloadType
    if (!JWTUser) {
        throw new ApiError("Unauthorized", 401)
    }

    const { id } = req.params as ById
    if (!id) {
        throw new ApiError("Business id is required")
    }

    const [business] = await db
        .select({
            id: businesses.id,
            isActive: businesses.isActive
        })
        .from(businesses)
        .where(
            and(
                eq(businesses.id, id),
                eq(businesses.ownerId, JWTUser.id)
            )
        )
        .limit(1)

    if (!business) {
        throw new ApiError("Business not found", 404)
    }

    const [updatedBusiness] = await db
        .update(businesses)
        .set({
            isActive: !business.isActive
        })
        .where(
            and(
                eq(businesses.id, id),
                eq(businesses.ownerId, JWTUser.id)
            )
        )
        .returning()

    if (!updatedBusiness) {
        throw new ApiError("Business update failed", 400)
    }

    return reply.status(200).send(
        new ApiResponse("Business status updated", 200, updatedBusiness)
    )
}

export const myBusinesses = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const JWTUser = req.user as JWTPayloadType
    if (!JWTUser) {
        throw new ApiError("Unauthorized", 401)
    }

    const userBusinesses = await db
        .select({
            id: businesses.id,
            name: businesses.name,
            slug: businesses.slug,
            isActive: businesses.isActive,
            reviewLink: businesses.reviewLink,
            createdAt: businesses.createdAt
        })
        .from(businesses)
        .where(
            eq(businesses.ownerId, JWTUser.id)
        )

    return reply.status(200).send(
        new ApiResponse("My businesses", 200, userBusinesses)
    )
}

export const getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const JWTUser = req.user as JWTPayloadType
    if (!JWTUser) {
        throw new ApiError("Unauthorized", 401)
    }

    const { id } = req.params as ById
    if (!id) {
        throw new ApiError("Business id is required")
    }

    const [business] = await db
        .select({
            id: businesses.id,
            name: businesses.name,
            slug: businesses.slug,
            isActive: businesses.isActive,
            reviewLink: businesses.reviewLink,
            createdAt: businesses.createdAt
        })
        .from(businesses)
        .where(
            and(
                eq(businesses.id, id),
                eq(businesses.ownerId, JWTUser.id)
            )
        )
        .limit(1)

    if (!business) {
        throw new ApiError("Business not found", 404)
    }

    return reply.status(200).send(
        new ApiResponse("Business", 200, business)
    )
}

export const getBySlug = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db

    const { slug } = req.params as BySlug
    if (!slug) {
        throw new ApiError("Business slug is required")
    }

    const [business] = await db
        .select({
            id: businesses.id,
            name: businesses.name,
            slug: businesses.slug,
            isActive: businesses.isActive,
            reviewLink: businesses.reviewLink,
            createdAt: businesses.createdAt
        })
        .from(businesses)
        .where(
            and(
                eq(businesses.slug, slug),
                eq(businesses.isActive, true)
            )
        )
        .limit(1)

    if (!business) {
        throw new ApiError("Business not found", 404)
    }

    return reply.status(200).send(
        new ApiResponse("Business", 200, business)
    )
}
