import {db} from '../index.js'
import { Chirp, chirps } from '../../schema.js'
import { asc } from 'drizzle-orm'

export async function getAllChirps(){
  const result: Chirp[] = await db.select().from(chirps).orderBy(asc(chirps.createdAt))
  return result
}
