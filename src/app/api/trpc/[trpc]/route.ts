import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/index"
import { serverContext } from "@/server/context"

const handler = (req: Request) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        router: appRouter,
        req,
        createContext: serverContext
    })
}

export { handler as GET, handler as POST }