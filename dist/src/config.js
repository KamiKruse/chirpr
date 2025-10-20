import 'dotenv/config';
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error('Environment variable not set');
    }
    return value;
}
const configObj = {
    fileserverHits: 0,
    dbConfig: {
        dbURL: envOrThrow('DB_URL'),
        migrationConfig: {
            migrationsFolder: './src/db/migrations',
        },
    },
    platform: process.env.PLATFORM || 'unknown',
    secret: process.env.SECRET
};
export { configObj };
