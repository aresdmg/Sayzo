import { router, publicProcedure } from "./trpc"
import z from "zod";

export const appRouter = router({
    health: publicProcedure
        .input(
            z.undefined()
        )
        .query(async({ ctx }) => {
            return {
                status: "ok",
                timestamp: new Date().toISOString()
            }
        })
})

export type AppRouter = typeof appRouter 