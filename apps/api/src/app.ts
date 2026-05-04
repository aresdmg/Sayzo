import Fastify from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import jwt from "@fastify/jwt"
import sensible from "@fastify/sensible"
import cookies from "@fastify/cookie"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"

export default function bootstrap() {
    const app = Fastify({
        logger: {
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname'
                }
            }
        }
    }).withTypeProvider<ZodTypeProvider>()

    app.register(cors, { 
        origin: "http://localhost:3000",
        credentials: true
    })
    app.register(jwt, {
        secret: process.env.JWT_SECRET!,
        sign: {
            expiresIn: "15m"
        }
    })
    app.register(sensible)
    app.register(helmet)
    app.register(cookies)

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    return app
}