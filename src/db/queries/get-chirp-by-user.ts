import { eq } from 'drizzle-orm'
import { chirps } from '../../schema.js'
import { db } from '../index.js'

export async function getChirpsByUserId(userId: string) {
  const result = await db.select().from(chirps).where(eq(chirps.userId, userId))
  return result
}
