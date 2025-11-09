import type { Request, Response, NextFunction } from 'express'
import {
  BadRequest_400_Error,
  Unauthorized_401_Error,
} from '../error-classes.js'
import { createChirp } from '../db/queries/create-chirp.js'
import { getBearerToken, validateJWT } from '../auth.js'
import { configObj } from '../config.js'

export async function handlerChirps(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerToken = getBearerToken(req)
    const authenticatedUser = validateJWT(bearerToken, configObj.jwt.secret)
    const { body } = req.body as { body?: string }
    if (!body) {
      throw new BadRequest_400_Error('Invalid request body')
    }

    const maxChirpLength = 140
    if (body.length > maxChirpLength) {
      throw new BadRequest_400_Error('Chirp is too long. Max length is 140')
    }
    const sanitizedBody = body.replace(/(kerfuffle|sharbert|fornax)/gi, '****')
    const chirp = await createChirp({
      body: sanitizedBody,
      userId: authenticatedUser,
    })
    res.status(201).json(chirp)
  } catch (error) {
    next(error)
  }
}
