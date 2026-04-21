import { initTRPC, TRPCError } from "@trpc/server"
import { ServerContext } from "./context"

const t = initTRPC.context<ServerContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

const isAuth = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "unauthorized request" })
    }

    return next({
        ctx: {
            ...ctx,
            user: ctx.user
        }
    })
})

const isAdmin = t.middleware(({ ctx, next }) => {
    if (ctx.user?.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN", message: "admin resources not allowed" })
    }

    return next()
})

export const protectedProcedure = publicProcedure.use(isAuth)
export const adminProcedure = protectedProcedure.use(isAdmin)