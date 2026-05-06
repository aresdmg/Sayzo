import bootstrap from "./app";
import dotenv from "dotenv";

function start() {
    dotenv.config({
        path: "./.env",
        quiet: true
    })

    const app = bootstrap()
    const port = Number(process.env.PORT) ?? 5000

    try {
        app.listen({ port })
    } catch (error) {
        app.log.fatal(error)
        process.exit(1)
    }
}

start()