import { db } from '../index.js';
import { users } from '../../schema.js';
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning({
        id: users.id,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        email: users.email,
        isChirpyRed: users.isChirpyRed
    });
    return result;
}
