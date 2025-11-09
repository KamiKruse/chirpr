import { relations } from 'drizzle-orm';
import { timestamp, varchar, uuid, pgTable, boolean } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar('email', { length: 256 }).unique().notNull(),
    hashedPassword: varchar('hashed_password').notNull().default('unset'),
    isChirpyRed: boolean('is_chirpy_red').default(false)
});
export const userRelations = relations(users, ({ many }) => ({
    chirps: many(chirps),
    refreshTokens: many(refreshTokens),
}));
export const chirps = pgTable('chirps', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar('body', { length: 140 }).notNull(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
});
export const chirpsRelations = relations(chirps, ({ one }) => ({
    user: one(users, {
        fields: [chirps.userId],
        references: [users.id],
    }),
}));
export const refreshTokens = pgTable('refresh_tokens', {
    token: varchar('token', { length: 512 }).primaryKey().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
});
export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}));
