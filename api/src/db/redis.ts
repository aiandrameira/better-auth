import { env } from "@/env"
import { RedisClient } from "bun"

const redisUrl = `redis://${env.REDIS_PASSWORD ? `:${env.REDIS_PASSWORD}@` : ""}${env.REDIS_HOST}:${env.REDIS_PORT}/${env.REDIS_DB}`

export const redis = new RedisClient(redisUrl)
