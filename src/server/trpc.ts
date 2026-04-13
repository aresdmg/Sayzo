import { initTRPC } from "@trpc/server"
import { ServerContext } from "./context"

const t = initTRPC.context<ServerContext>().create()

export const router = t.router
export const publicProcedure = t.procedure