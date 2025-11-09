import { db } from '../index.js'
import { users } from '../../schema.js'
import { eq } from 'drizzle-orm'

export async function updateUser(userID: string, email: string, hashedPassword: string) {
  const [result] = await db
    .update(users)
    .set({ email: email, hashedPassword: hashedPassword})
    .where(eq(users.id, userID))
    .returning()

  return result
   
}
