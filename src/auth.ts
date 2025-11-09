import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import {
  BadRequest_400_Error,
  Forbidden_403_Error,
  Unauthorized_401_Error,
} from './error-classes.js'
import { Request } from 'express'
import { randomBytes } from 'node:crypto'
import { refreshTokens } from './schema.js'

const TOKEN_ISSUER = 'chirpy'

export async function hashPassword(password: string): Promise<string> {
  try {
    if (!password) {
      throw new Error('no password provided')
    }
    const hash = await argon2.hash(password)
    return hash
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }
    return 'Something went wrong'
  }
}

export async function checkPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    if (!password || !hash) {
      throw new Error('no password or hash found')
    }
    if (await argon2.verify(hash, password)) {
      return true
    } else {
      return false
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return false
    }
    console.error('Something went wrong')
    return false
  }
}

type Payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const timeNow = Math.floor(Date.now() / 1000)

  const payload: Payload = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: timeNow,
    exp: expiresIn + timeNow,
  }

  const token = jwt.sign(payload, secret)

  return token
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decodedPayload = jwt.verify(tokenString, secret)

    if (!decodedPayload || typeof decodedPayload === 'string') {
      throw new Unauthorized_401_Error('Invalid Token')
    }
    if (decodedPayload.iss !== TOKEN_ISSUER) {
      throw new Unauthorized_401_Error('Invalid Token issuer')
    }
    if (!decodedPayload.sub) {
      throw new Unauthorized_401_Error('No userID found in token')
    }
    return decodedPayload.sub
  } catch (error) {
    if (error instanceof Error) {
      throw new Unauthorized_401_Error('Invalid Token')
    }
    return 'Something went wrong'
  }
}

export function getBearerToken(req: Request): string {
  const returnForReqGet = req.get('Authorization')
  if (!returnForReqGet) {
    throw new Unauthorized_401_Error('Bearer Token not found')
  }
  const split = returnForReqGet.split(' ')
  if (split.length < 2 || split[0] !== 'Bearer') {
    throw new BadRequest_400_Error('Malformed authorization header')
  }
  return split[1]
}

export function makeRefreshToken(): string {
  const buf = randomBytes(256)
  return buf.toString('hex')
}

export function getAPIKey(req: Request) {
  const apiKeyVal = req.get('Authorization')
  if (!apiKeyVal) {
    throw new Unauthorized_401_Error('API key not found')
  }
  const split = apiKeyVal.split(' ')
  if (split.length < 2 || split[0] !== 'ApiKey') {
    throw new BadRequest_400_Error('Malformed authorization header')
  }
  return split[1]
}
