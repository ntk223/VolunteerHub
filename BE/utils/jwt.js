import jwt from 'jsonwebtoken';
import {env} from '../config/environment.js';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRE = env.JWT_EXPIRE;

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRE});
}

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}