import { FastifyError, FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/payload";
import fp from "fastify-plugin";

const errorHandlerPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.setErrorHandler(
        (err: FastifyError, _req: FastifyRequest, reply: FastifyReply) => {
            app.log.error(err);

            if (err instanceof ApiError) {
                return reply.status(err.statusCode).send({
                    success: false,
                    message: err.message,
                    error: err.errors,
                });
            }

            return reply.status(500).send({
                success: false,
                message: "Something went wrong",
            });
        },
    );
};

export default fp(errorHandlerPlugin);
