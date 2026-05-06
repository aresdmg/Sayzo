import { initDB, type DBClinet } from "@repo/db";
import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin"

declare module "fastify" {
    interface FastifyInstance {
        db: DBClinet["db"]
    }
}

const dbPlugin: FastifyPluginAsync = async (app: FastifyInstance, _opts: FastifyPluginOptions) => {
    const { db, pool } = initDB()
    app.decorate("db", db)
    app.addHook("onClose", () => {
        pool.end()
    })
}

export default fp(dbPlugin)