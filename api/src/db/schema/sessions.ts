import { randomUUIDv7 } from "bun"
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

export const sessions = pgTable(
    "sessions",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUIDv7()),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        ipAddress: text("ip_address"),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        userAgent: text("user_agent"),
    },
    (table) => [index("sessions_userId_idx").on(table.userId)],
)
