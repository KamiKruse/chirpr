import 'dotenv/config';
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error('Environment variable not set');
    }
    return value;
}
const migrationConfig = {
    migrationsFolder: './src/db/migrations',
};
const configObj = {
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
};
export { configObj };
