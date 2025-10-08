import 'dotenv/config'


export const env = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    APP_PORT: process.env.APP_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
    // REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    // REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
    // REDIS_PORT: process.env.REDIS_PORT,
    // CACHE_EXPIRATION: process.env.CACHE_EXPIRATION,
}