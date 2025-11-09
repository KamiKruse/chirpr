import { db } from '../index.js';
import { refreshTokens, users } from '../../schema.js';
import { and, eq, isNull, gt } from 'drizzle-orm';
export async function getUserFromRefreshToken(refreshToken) {
    const [result] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
        .where(and(eq(refreshTokens.token, refreshToken), isNull(refreshTokens.revokedAt), gt(refreshTokens.expiresAt, new Date())))
        .limit(1);
    return result;
}
