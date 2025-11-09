import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { BadRequest_400_Error, Unauthorized_401_Error, } from './error-classes.js';
import { randomBytes } from 'node:crypto';
const TOKEN_ISSUER = 'chirpy';
export async function hashPassword(password) {
    try {
        if (!password) {
            throw new Error('no password provided');
        }
        const hash = await argon2.hash(password);
        return hash;
    }
    catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
        return 'Something went wrong';
    }
}
export async function checkPassword(password, hash) {
    try {
        if (!password || !hash) {
            throw new Error('no password or hash found');
        }
        if (await argon2.verify(hash, password)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return false;
        }
        console.error('Something went wrong');
        return false;
    }
}
export function makeJWT(userID, expiresIn, secret) {
    const timeNow = Math.floor(Date.now() / 1000);
    const payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: timeNow,
        exp: expiresIn + timeNow,
    };
    const token = jwt.sign(payload, secret);
    return token;
}
export function validateJWT(tokenString, secret) {
    try {
        const decodedPayload = jwt.verify(tokenString, secret);
        if (!decodedPayload || typeof decodedPayload === 'string') {
            throw new Unauthorized_401_Error('Invalid Token');
        }
        if (decodedPayload.iss !== TOKEN_ISSUER) {
            throw new Unauthorized_401_Error('Invalid Token issuer');
        }
        if (!decodedPayload.sub) {
            throw new Unauthorized_401_Error('No userID found in token');
        }
        return decodedPayload.sub;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Unauthorized_401_Error('Invalid Token');
        }
        return 'Something went wrong';
    }
}
export function getBearerToken(req) {
    const returnForReqGet = req.get('Authorization');
    if (!returnForReqGet) {
        throw new Unauthorized_401_Error('Bearer Token not found');
    }
    const split = returnForReqGet.split(' ');
    if (split.length < 2 || split[0] !== 'Bearer') {
        throw new BadRequest_400_Error('Malformed authorization header');
    }
    return split[1];
}
export function makeRefreshToken() {
    const buf = randomBytes(256);
    return buf.toString('hex');
}
export function getAPIKey(req) {
    const apiKeyVal = req.get('Authorization');
    if (!apiKeyVal) {
        throw new Unauthorized_401_Error('API key not found');
    }
    const split = apiKeyVal.split(' ');
    if (split.length < 2 || split[0] !== 'ApiKey') {
        throw new BadRequest_400_Error('Malformed authorization header');
    }
    return split[1];
}
