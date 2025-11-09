import 'dotenv/config'
import type { MigrationConfig } from 'drizzle-orm/migrator'

type Config = {
  api: APIConfig
  db: DBConfig
  jwt: JWTConfig
}
type DBConfig = {
  dbURL: string
  migrationConfig: MigrationConfig
}
type JWTConfig = {
  defaultDuration: number,
  refreshDuration: number,
  issuer: string,
  secret: string
}
type APIConfig = {
  fileserverHits: number,
  platform: string,
  port: number,
  apiKey: string
}

function envOrThrow(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error('Environment variable not set')
  }
  return value
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: './src/db/migrations',
}

const configObj: Config = {
  api: {
    fileserverHits: 0,
    platform: envOrThrow('PLATFORM'),
    port: Number(envOrThrow('PORT')),
    apiKey: envOrThrow('POLKA_KEY')
  },
  db: {
    dbURL: envOrThrow('DB_URL'),
    migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60,
    refreshDuration: 60 * 60 * 24 * 60 * 1000,
    issuer: 'chirpy',
    secret: envOrThrow('SECRET'),
  },
}
export { configObj }
