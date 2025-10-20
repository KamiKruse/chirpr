import { Response, Request, NextFunction } from 'express'
import { getAllChirps } from '../db/queries/read-chirps.js'
import { NotFound_404_Error } from '../error-classes.js'

export async function handlerGetChirps(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await getAllChirps()
    if (!response || response.length === 0) {
      throw new NotFound_404_Error('Chirps not found!')
    }
    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
}
