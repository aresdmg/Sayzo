import { userRoutes } from "./routes/user"
import { router } from "./trpc"

export const appRouter = router({
    user: userRoutes,
})

export type AppRouter = typeof appRouter 