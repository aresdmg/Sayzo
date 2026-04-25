import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { businessByIdSchema, businessesSchema } from "@/types/business";
import { businesses, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const businessRoutes = router({
    create: protectedProcedure
        .input(businessesSchema)
        .mutation(
            async ({ ctx, input }) => {
                const { name } = input
                const ownerId = ctx.user.id

                if (!name) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Business name is required" })
                }

                if (!ownerId) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Owner id is required" })
                }

                const baseSlug = name.toLowerCase().trim().replaceAll(" ", "")
                const uniqueSuffix = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`
                const slug = `${baseSlug}${uniqueSuffix}`

                const [existingSlug] = await ctx.db
                    .select()
                    .from(businesses)
                    .where(
                        and(
                            eq(businesses.slug, slug),
                            eq(businesses.ownerId, ctx.user.id)
                        )
                    ).limit(1)

                if (existingSlug) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Business already exists" })
                }

                const [user] = await ctx.db
                    .select({
                        id: users.id,
                        email: users.email
                    })
                    .from(users)
                    .where(
                        and(
                            eq(users.id, ownerId),
                            eq(users.name, ctx.user.name)
                        )
                    ).limit(1)

                if (!user) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
                }

                const [createdBusiness] = await ctx.db
                    .insert(businesses)
                    .values({
                        name,
                        ownerId,
                        slug
                    })
                    .returning()

                if (!createdBusiness) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create business" })
                }

                return { success: true }
            }),

    toggleActivity: protectedProcedure
        .input(businessByIdSchema)
        .mutation(
            async ({ ctx, input }) => {
                const businessId = input.id
                const userId = ctx.user.id

                const [business] = await ctx.db
                    .select({
                        isActive: businesses.isActive
                    })
                    .from(businesses)
                    .where(
                        and(
                            eq(businesses.id, businessId),
                            eq(businesses.ownerId, userId)
                        )
                    )

                if (!business) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" })
                }

                const [updatedBusiness] = await ctx.db
                    .update(businesses)
                    .set({
                        isActive: !business.isActive
                    })
                    .where(
                        and(
                            eq(businesses.id, businessId),
                            eq(businesses.ownerId, userId)
                        )
                    )
                    .returning()

                if (!updatedBusiness) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to toggle activity" })
                }

                return updatedBusiness
            }
        ),

    delete: protectedProcedure
        .input(businessByIdSchema)
        .mutation(
            async ({ ctx, input }) => {
                const userId = ctx.user.id
                const businessId = input.id

                const [business] = await ctx.db
                    .select({
                        isActive: businesses.isActive
                    })
                    .from(businesses)
                    .where(
                        and(
                            eq(businesses.id, businessId),
                            eq(businesses.ownerId, userId)
                        )
                    )

                if (!business) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" })
                }

                const [deletedBusiness] = await ctx.db
                    .delete(businesses)
                    .where(
                        and(
                            eq(businesses.id, businessId),
                            eq(businesses.ownerId, userId)
                        )
                    )
                    .returning()

                if (!deletedBusiness) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete business" })
                }

                return deletedBusiness
            }
        ),

    myBusinesses: protectedProcedure
        .query(
            async ({ ctx }) => {
                const ctxUser = ctx.user
                if (!ctxUser) {
                    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized request" })
                }

                const rawBusinessInfo = await ctx.db
                    .select()
                    .from(businesses)
                    .where(
                        eq(businesses.ownerId, ctxUser.id)
                    )

                const processedBusinessInfo = rawBusinessInfo.map(({ ownerId, ...rest }) => rest)

                return processedBusinessInfo
            }
        ),

    getById: protectedProcedure
        .input(businessByIdSchema)
        .query(
            async ({ ctx, input }) => {
                if (!input.id) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Business id is required" })
                }
                const userId = ctx.user.id
                const [user] = await ctx.db
                    .select({ id: users.name })
                    .from(users)
                    .where(
                        eq(users.id, userId)
                    ).limit(1)
                if (!user) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })
                }
                const [business] = await ctx.db
                    .select()
                    .from(businesses)
                    .where(
                        and(
                            eq(businesses.id, input.id),
                            eq(businesses.ownerId, ctx.user.id)
                        )
                    ).limit(1)
                return business
            }
        ),

    createReviewLink: protectedProcedure
        .input(businessByIdSchema)
        .mutation(
            async ({ ctx, input }) => {
                const businessId = input.id
                const userId = ctx.user.id

                const [business] = await ctx.db
                    .select()
                    .from(businesses)
                    .where(
                        and(
                            eq(businesses.id, businessId),
                            eq(businesses.ownerId, userId)
                        )
                    ).limit(1)

                if (!business) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" })
                }

                const reviewLink = `/r/` + `${business.slug}`

                const [updatedBusiness] = await ctx.db
                    .update(businesses)
                    .set({
                        reviewLink
                    })
                    .where(
                        and(
                            eq(businesses.id, businessId),
                            eq(businesses.ownerId, userId)
                        )
                    ).returning()

                if (!updatedBusiness) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to generate business link" })
                }

                return updatedBusiness
            }
        )
})