type ResponseType = "success" | "error"

export type IPaginated<T> = {
    data: T[]
    total: number
    page: number
    size: number
}

type Meta = {
    message: string
    status: number
    type: ResponseType
}

export type PaginatedResponse<T> = {
    data: T[]
    page: number
    size: number
    total: number
    meta: Meta
}

export type ListResponse<T> = {
    data: T[]
    total: number
    meta: Meta
}

export type ItemResponse<T> = {
    data: T
    meta: Meta
}

export type SuccessResponse = {
    data: null
    meta: Meta
}

export type ErrorResponse = {
    data: null
    meta: Meta
}

export const ApiResponse = {
    paginated<T>(result: IPaginated<T>, message = "OK", status = 200): PaginatedResponse<T> {
        return {
            data: result.data,
            page: result.page,
            size: result.size,
            total: result.total,
            meta: { message, status, type: "success" },
        }
    },

    list<T>(data: T[], message = "OK", status = 200): ListResponse<T> {
        return {
            data,
            total: data.length,
            meta: { message, status, type: "success" },
        }
    },

    item<T>(data: T, message = "OK", status = 200): ItemResponse<T> {
        return {
            data,
            meta: { message, status, type: "success" },
        }
    },

    success(message = "OK", status = 200): SuccessResponse {
        return {
            data: null,
            meta: { message, status, type: "success" },
        }
    },

    error(message: string, status: number): ErrorResponse {
        return {
            data: null,
            meta: { message, status, type: "error" },
        }
    },
}
