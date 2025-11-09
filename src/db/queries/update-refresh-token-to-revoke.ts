import { db } from '../index.js'
import { refreshTokens } from '../../schema.js'
import { eq } from 'drizzle-orm'

export async function getUserToRevokeRefreshToken(refreshToken: string) {
  const rows = await db
    .update(refreshTokens)
    .set({ expiresAt: new Date() })
    .where(eq(refreshTokens.token, refreshToken))
    .returning()

    if(rows.length === 0){
      throw new Error("Couldn't revoke token ")
    }
}
