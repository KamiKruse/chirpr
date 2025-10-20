import type { Request, Response, NextFunction } from 'express'
import { getSingleChirp } from '../db/queries/read-single-chirp.js'
import { BadRequest_400_Error, NotFound_404_Error } from '../error-classes.js'

export async function handlerGetSingleChirp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const chirpId = req.params.chirpId
    if (!chirpId) {
      throw new BadRequest_400_Error('No chirp ID in params')
    }
    const singleChirp = await getSingleChirp(chirpId)

    if (!singleChirp) {
      throw new NotFound_404_Error('Chirp not found')
    }
    res.status(200).json(singleChirp)  
  } catch (error) {
    next(error)
  }
  
}
 