import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify"
import { initDB, type DBClinet } from "@repo/db"

declare module "fastify" {
    interface FastifyInstance {
        db: DBClinet["db"]
    }
}

const databasePlugin: FastifyPluginAsync = async (fastify: FastifyInstance, _opts: FastifyPluginOptions) => {
    const { db, pool } = initDB()
    fastify.decorate("db", db)
    fastify.addHook("onClose", () => {
        pool.end()
    })
}

export default databasePlugin
