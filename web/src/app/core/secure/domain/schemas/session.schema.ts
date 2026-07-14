import z from "zod";

export const sessionSchema = z.object({
    expiresAt: z.string(),
    token: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    ipAddress: z.string(),
    userAgent: z.string(),
    userId: z.string(),
    id: z.string(),
});

export const userSchema = z.object({
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string(),
});

export const sessionWithUserSchema = z.object({
    session: sessionSchema,
    user: userSchema,
});

export type SessionDto = z.infer<typeof sessionSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type SessionResponseDto = z.infer<typeof sessionWithUserSchema>;
