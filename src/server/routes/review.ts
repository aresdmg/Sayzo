import { publicProcedure, router } from "../trpc";
import { createReviewSchema } from "@/types/review";
import { TRPCError } from "@trpc/server";
import { businesses, reviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const reviewRoutes = router({
    create: publicProcedure
        .input(createReviewSchema)
        .mutation(
            ({ ctx, input }) => {
                return ctx.db.transaction(async (tx) => {
                    const businessId = input.businessId
                    const { content, rating, fingerprint } = input
                    if (!content || !rating || !fingerprint) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "Missing information" })
                    }

                    if (!businessId) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "Business id is required" })
                    }

                    const [business] = await tx
                        .select({
                            id: businesses.id,
                            name: businesses.name,
                            ownerId: businesses.ownerId
                        })
                        .from(businesses)
                        .where(
                            eq(businesses.id, businessId)
                        )
                        .limit(1)

                    if (!business) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "Business not found" })
                    }

                    const [exitingReview] = await tx
                        .select()
                        .from(reviews)
                        .where(
                            and(
                                eq(reviews.fingerprint, fingerprint)
                            )
                        )
                        .limit(1)

                    if (exitingReview) {
                        throw new TRPCError({ code: "BAD_REQUEST", message: "Review exists" })
                    }

                    const [createdReview] = await tx
                        .insert(reviews)
                        .values({
                            businessId: business.id,
                            content,
                            rating,
                            fingerprint
                        })
                        .returning()

                    if (!createdReview) {
                        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create review" })
                    }

                    return createReviewSchema
                })
            }
        )
})