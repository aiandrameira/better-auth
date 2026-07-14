import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.url().startsWith("postgresql://"),

    FRONT_URLS: z
        .string()
        .default("http://localhost:4200")
        .transform(value => value.split(",").map(url => url.trim())),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    RESEND_API_KEY: z.string(),
    DEFAULT_MAIL_FROM: z.string(),

    SESSION_EXPIRES_IN: z.coerce.number().default(60 * 60), // segundos — padrão: 1 hora
    SESSION_COOKIE_CACHE_MAX_AGE: z.coerce.number().default(60 * 5), // segundos — padrão: 5 min

    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional().describe("Redis password (optional)"),
    REDIS_DB: z.coerce.number().min(0).max(15).default(0).describe("Redis database number"),
})

const parsedEnv = envSchema.parse(Bun.env)

export const env = {
    ...parsedEnv,
    FRONT_URL: parsedEnv.FRONT_URLS[0],
}
