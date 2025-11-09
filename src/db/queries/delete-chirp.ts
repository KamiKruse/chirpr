import { and, eq } from 'drizzle-orm'
import { chirps} from '../../schema.js'
import { db } from '../index.js'

export async function chirpDelete(chirpID: string, userID: string) {
  const result = await db.delete(chirps).where(
    and 
    (
      eq(chirps.id, chirpID),
      eq(chirps.userId, userID)
    )
  ).returning()

  return result
}
