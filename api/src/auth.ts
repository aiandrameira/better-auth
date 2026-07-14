import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { Resend } from 'resend';

import { db } from './db/client';
import { redis } from './db/redis';
import { env } from './env';
import { getVerificationEmailHtml } from './http/template/email-verifier.template';
import { getPasswordResetEmailHtml } from './http/template/reset-password.template';

const resend = new Resend(env.RESEND_API_KEY)

export const auth = betterAuth({
    basePath: "/auth",
    plugins: [openAPI()],
    trustedOrigins: env.FRONT_URLS,
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
    }),
    advanced: {
        database: {
            generateId: false,
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        password: {
            hash: (password: string) => Bun.password.hash(password),
            verify: ({ password, hash }: { password: string; hash: string }) => Bun.password.verify(password, hash),
        },
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            const resetEmailHtml = getPasswordResetEmailHtml(url, user.name)

            resend.emails.send({
                from: env.DEFAULT_MAIL_FROM,
                to: user.email,
                subject: "Redefina sua senha",
                html: resetEmailHtml,
            })
        },
    },
    session: {
        expiresIn: env.SESSION_EXPIRES_IN,
        updateAge: 0,
        cookieCache: {
            enabled: true,
            maxAge: env.SESSION_COOKIE_CACHE_MAX_AGE,
        },
    },
    secondaryStorage: {
        get: async (key: string) => {
            return await redis.get(key)
        },
        set: async (key: string, value: string, ttl?: number) => {
            await redis.set(key, value)

            if (ttl) {
                await redis.expire(key, ttl)
            }
        },
        delete: async (key: string) => {
            await redis.del(key)
        },
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const emailHtml = getVerificationEmailHtml(url, user.name)

            resend.emails.send({
                from: env.DEFAULT_MAIL_FROM,
                to: user.email,
                subject: "Verifique seu email",
                html: emailHtml,
            })
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 30, // 30 minutes
    },
})
