import { db } from "@/db"

export const serverContext = async () => {
    return {
        db
    }
}

export type ServerContext = Awaited<ReturnType<typeof serverContext>>