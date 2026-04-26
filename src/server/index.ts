import { businessRoutes } from "./routes/business"
import { reviewRoutes } from "./routes/review"
import { userRoutes } from "./routes/user"
import { router } from "./trpc"

export const appRouter = router({
    user: userRoutes,
    business: businessRoutes,
    review: reviewRoutes
})

export type AppRouter = typeof appRouter 