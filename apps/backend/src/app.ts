import Fastify from 'fastify'
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import jwt from "@fastify/jwt"
import sensible from "@fastify/sensible"
import cookies from "@fastify/cookie"
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import db from './plugin/db.js'
import auth from './plugin/auth.js'
import error from './plugin/error.js'

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

    app.register(helmet)
    app.register(cookies)
    app.register(cors, {
        origin: process.env.ORIGIN!,
        credentials: true,
    })
    app.register(sensible)
    app.register(jwt, {
        secret: process.env.JWT_SECRET!,
        sign: {
            expiresIn: "15m"
        }
    })

    app.register(db)
    app.register(auth)
    app.register(error)

    return app
}
