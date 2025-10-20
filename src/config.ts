import 'dotenv/config'
import type { MigrationConfig } from 'drizzle-orm/migrator'


type APIConfig = {
  fileserverHits: number,
  dbConfig: {
    dbURL: string,
    migrationConfig : MigrationConfig
  }
  platform: string,
  secret: string
}

function envOrThrow(key:string){
  const value = process.env[key]
  if(!value){
    throw new Error('Environment variable not set')
  }
  return value
}

const configObj: APIConfig = {
  fileserverHits: 0,
  dbConfig: {
    dbURL: envOrThrow('DB_URL'),
    migrationConfig: {
      migrationsFolder: './src/db/migrations',
    },
  },
  platform: process.env.PLATFORM || 'unknown',
  secret: process.env.SECRET!
}
export {configObj}
