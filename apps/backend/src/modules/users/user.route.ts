import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import * as controller from "./user.controller"
import { validate } from "../../utils/validate";
import { loginSchema, registerSchema } from "./user.types";

export const userRoute = (app: FastifyInstance, _opts: FastifyPluginOptions) => {
    app.post(
        '/',
        { preValidation: validate(registerSchema) },
        async (req: FastifyRequest, reply: FastifyReply) => controller.registerUser(req, reply)
    )

    app.post(
        '/login',
        { preValidation: validate(loginSchema) },
        async (req: FastifyRequest, reply: FastifyReply) => controller.loginUser(req, reply)
    )
}