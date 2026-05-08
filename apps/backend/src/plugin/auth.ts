import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin"

export type JWTPayloadType = {
    id: string;
    name: string;
    email: string;
    role: string
}

declare module "fastify" {
    interface FastifyInstance {
        auth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
}

const authPlugin: FastifyPluginAsync = async (app: FastifyInstance, _opts: FastifyPluginOptions) => {
    app.decorate("auth", async (req: FastifyRequest, _reply: FastifyReply) => {
        try {
            let token;

            const authHeader = req.headers.authorization
            token = authHeader?.split(" ")[1] || req.cookies?.sayzo_access_token

            if (!token) {
                throw app.httpErrors.unauthorized("Missing or invalid token")
            }

            const decodeInfo = app.jwt.decode<JWTPayloadType>(token)
            if (!decodeInfo) {
                throw app.httpErrors.unauthorized("Invalid jwt token")
            }
            req.user = decodeInfo
        } catch (error) {
            app.log.error(error)
            throw app.httpErrors.unauthorized("Token validation failed")
        }
    })
}

export default fp(authPlugin)