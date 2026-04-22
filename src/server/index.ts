import { businessRoutes } from "./routes/business"
import { userRoutes } from "./routes/user"
import { router } from "./trpc"

export const appRouter = router({
    user: userRoutes,
    business: businessRoutes
})

export type AppRouter = typeof appRouter 