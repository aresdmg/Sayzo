import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import * as controller from "./business.controller.js"

export const businessRoute = (app: FastifyInstance, _opts: FastifyPluginOptions) => {
    app.post(
        "/",
        { preHandler: [app.auth] },
        async (req: FastifyRequest, reply: FastifyReply) => controller.createBusiness(req, reply)
    )

    app.delete(
        "/:id",
        { preHandler: [app.auth] },
        async (req: FastifyRequest, reply: FastifyReply) => controller.deleteBusiness(req, reply)
    )

    app.put(
        "/:id",
        { preHandler: [app.auth] },
        async (req: FastifyRequest, reply: FastifyReply) => controller.toggleActive(req, reply)
    )

    app.get(
        "/my-businesses",
        { preHandler: [app.auth] },
        async (req: FastifyRequest, reply: FastifyReply) => controller.myBusinesses(req, reply)
    )

    app.get(
        "/:id",
        { preHandler: [app.auth] },
        async (req: FastifyRequest, reply: FastifyReply) => controller.getById(req, reply)
    )

    app.get(
        "/slug/:slug",
        async (req: FastifyRequest, reply: FastifyReply) => controller.getBySlug(req, reply)
    )
}