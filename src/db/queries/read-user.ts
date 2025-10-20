import { db } from "../index.js";
import { users } from "../../schema.js";
import { eq } from "drizzle-orm";

export async function userExists(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email))
  return result
}
