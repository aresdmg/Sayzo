import { FastifyReply, FastifyRequest } from "fastify"
import { CreateReview } from "./review.types.js"
import { ApiError, ApiResponse } from "../../utils/payload.js"
import { businesses, reviews } from "../../db/schema.js"
import { and, eq } from "drizzle-orm"

export const create = async (req: FastifyRequest, reply: FastifyReply) => {
    const db = req.server.db
    const { businessId, rating, content, fingerprint } = req.body as CreateReview

    if (!businessId || !rating || !content || !fingerprint) {
        throw new ApiError("Missing review information", 400)
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError("Rating must be between 1 and 5", 400)
    }

    const [business] = await db
        .select({
            id: businesses.id
        })
        .from(businesses)
        .where(
            and(
                eq(businesses.id, businessId),
                eq(businesses.isActive, true)
            )
        )
        .limit(1)

    if (!business) {
        throw new ApiError("Business not found", 404)
    }

    const [createdReview] = await db
        .insert(reviews)
        .values({
            businessId: business.id,
            rating,
            content,
            fingerprint
        })
        .returning()

    if (!createdReview) {
        throw new ApiError("Review creation failed", 500)
    }

    return reply.status(201).send(
        new ApiResponse("Review created", 201, createdReview)
    )
}