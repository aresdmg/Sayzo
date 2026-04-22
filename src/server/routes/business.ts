import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { businessesSchema } from "@/types/business";
import { businesses, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const businessRoutes = router({
    create: protectedProcedure
        .input(businessesSchema)
        .mutation(
            async ({ ctx, input }) => {
                const { name, ownerId } = input
                if (!name || !ownerId) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Business name is required" })
                }

                const slug = name.toLowerCase().trim().replaceAll(" ", "-")
                const [existingSlug] = await ctx.db
                    .select()
                    .from(businesses)
                    .where(
                        and(
                            eq(businesses.slug, slug),
                            eq(businesses.ownerId, ownerId)
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
})