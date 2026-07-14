import { Elysia } from "elysia"

import { openapi } from "@elysia/openapi"
import cors from "@elysiajs/cors"

import { env } from "./env"
import { ApiResponse } from "./http/api/response"
import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth"

const start = async () => {
    const app = new Elysia()
        .use(cors({ origin: env.FRONT_URLS }))
        .use(
            openapi({
                documentation: {
                    components: await OpenAPI.components,
                    paths: await OpenAPI.getPaths(),
                },
            }),
        )
        .onError(({ error, set }) => {
            const status = "status" in error && typeof error.status === "number" ? error.status : 500
            set.status = status
            return ApiResponse.error("message" in error ? error.message : "Internal server error", status)
        })
        .use(betterAuthPlugin)
        .listen(3000)

    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
    console.log(` 📚 OpenAPI documentation available at ${app.server?.hostname}:${app.server?.port}/openapi`)
}

start()
