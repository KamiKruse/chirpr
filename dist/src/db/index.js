import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../schema.js';
import { configObj } from '../config.js';
const migrationClient = postgres(configObj.dbConfig.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), configObj.dbConfig.migrationConfig);
const conn = postgres(configObj.dbConfig.dbURL);
export const db = drizzle(conn, { schema });
