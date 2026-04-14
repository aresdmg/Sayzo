import { appRouter } from "@/server"
import { serverContext } from "@/server/context"
import { Login } from "@/types/auth"

export async function POST(req: Request) {
    const body = req.json() as unknown

    const caller = appRouter.createCaller(await serverContext())

    const res = await caller.user.loginUser(body as Login)
    if (res.success) {

    }
}