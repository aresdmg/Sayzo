import bootstrap from "./app";

function start() {
    const app = bootstrap()
    const port = Number(process.env.PORT) ?? 5000

    try {
        app.listen({ port })
        app.log.info(`server up and running @ localhost:${port}`)
    } catch (error) {
        app.log.fatal(error)
        process.exit(1)
    }
}

start()