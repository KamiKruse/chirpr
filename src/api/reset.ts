import type { NextFunction, Request, Response } from 'express'
import { configObj } from '../config.js'
import { deleteUsers } from '../db/queries/delete-users.js'
import { Forbidden_403_Error } from '../error-classes.js'

export const handlerReset = async (_: Request, res: Response, next: NextFunction) => {
  try {
    configObj.fileserverHits = 0
    if (configObj.platform !== 'dev') {
      throw new Forbidden_403_Error('Access Denied')
    }
    await deleteUsers()
    res.send(
      `All users in the DB have been deleted and Reset fileserver hits to 0. Hits: ${configObj.fileserverHits}`
    )
  } catch (error) {
    next(error)
  }
}
