import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin"

declare module "fastify" {
    interface FastifyInstance {
        auth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
}

const authPlugin: FastifyPluginAsync = async (app: FastifyInstance, opts: FastifyPluginOptions) => {
    app.decorate("auth", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            let token;

            const authHeader = req.headers.authorization
            token = authHeader?.split(" ")[1] || req.cookies?.sayzo_access_token

            if (!token) {
                throw app.httpErrors.unauthorized("Missing or invalid token")
            }

        } catch (error) {
            
        }
    })
}

export default fp(authPlugin)