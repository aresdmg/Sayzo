import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import * as controller from "./review.controller.js"

export const reviewRoute = (app: FastifyInstance, _opts: FastifyPluginOptions) => {
    app.post(
        "/",
        async (req: FastifyRequest, reply: FastifyReply) => controller.create(req, reply)
    )
}
