import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

export const validate = (schema: z.ZodType) =>
    (req: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            reply.status(400).send({
                message: "Validation error",
                errors: z.treeifyError(result.error)
            })
            return;
        }

        req.body = result.data
        done()
    }