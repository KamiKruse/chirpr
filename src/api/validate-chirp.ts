import type { Request, Response, NextFunction } from 'express'
import { BadRequest_400_Error } from '../error-classes.js'
export const handlerValidateChirpBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  type Parameters = {
    body: string
  }

  try {
    const parsedBody: Parameters = req.body
    if (!parsedBody || !Object.hasOwn(parsedBody, 'body')) {
      throw new BadRequest_400_Error('Invalid request body')
    }
    const maxChirpLength = 140
    if (parsedBody.body.length > maxChirpLength) {
      throw new BadRequest_400_Error('Chirp is too long. Max length is 140')
    }
    parsedBody.body = parsedBody.body.replace(
      /(kerfuffle|sharbert|fornax)/gi,
      '****'
    )

    res.status(200).send({ cleanedBody: parsedBody.body })
  } catch (error) {
    next(error)
  }
}
