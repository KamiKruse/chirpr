import { db } from '../index.js'
import { refreshTokens } from '../../schema.js'
import { sql } from 'drizzle-orm'
import { configObj } from '../../config.js'

export async function createRefreshTokens(
  refreshToken: string,
  userId: string
) {
  const rows = await db
    .insert(refreshTokens)
    .values({
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + configObj.jwt.refreshDuration ),
      revokedAt: null,
    })
    .returning()
  return rows.length > 0
}
