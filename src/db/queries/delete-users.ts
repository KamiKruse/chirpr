import { users } from "../../schema.js";
import { db } from "../index.js";

export async function deleteUsers() {
  await db.delete(users)
}

