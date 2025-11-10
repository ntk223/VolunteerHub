import mysql from 'mysql2/promise';
import { env } from './environment.js';
const connection = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME
});

export default connection;