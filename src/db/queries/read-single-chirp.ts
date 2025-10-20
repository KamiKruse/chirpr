import { eq } from "drizzle-orm";
import { chirps } from "../../schema.js";
import { db } from "../index.js";

export async function getSingleChirp(queryChirp: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, queryChirp))
  return result
}
