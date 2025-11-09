import { Response, Request, NextFunction } from 'express'
import { getAllChirps } from '../db/queries/read-chirps.js'
import { NotFound_404_Error } from '../error-classes.js'
import { getChirpsByUserId } from '../db/queries/get-chirp-by-user.js'

export async function handlerGetChirps(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.query.authorId) {
      let authorId = ''
      let authorIdQuery = req.query.authorId
      if (typeof authorIdQuery === 'string') {
        authorId = authorIdQuery
      }
      const chirpForThatAuthor = await getChirpsByUserId(authorId)
      if (!chirpForThatAuthor || chirpForThatAuthor.length === 0) {
        throw new NotFound_404_Error('Chirp for that Author not found!')
      }
      res.status(200).json(chirpForThatAuthor)
    } else {
      const response = await getAllChirps()
      
      if (!response || response.length === 0) {
        throw new NotFound_404_Error('Chirps not found!')
      }
      if (req.query.sort) {
        if (req.query.sort === 'desc') {
          response.sort((a, b) => {
            if (a.createdAt !== undefined && b.createdAt !== undefined) {
              return b.createdAt.getTime() - a.createdAt.getTime()
            }
            return 0
          })
       
          return res.status(200).json(response)
        }
      }
      return res.status(200).json(response)
    }
  } catch (error) {
    next(error)
  }
}
