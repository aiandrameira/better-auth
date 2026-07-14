import { z } from "zod"

export const paginationQuerySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).max(100).default(10),
})

export type PaginationParams = z.infer<typeof paginationQuerySchema>
