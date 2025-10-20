import { Chirp, chirps} from '../../schema.js'
import { db } from '../index.js'

export async function createChirp(chirp: Chirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning()
  return result
}
