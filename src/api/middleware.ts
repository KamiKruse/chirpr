import type { NextFunction, Request, Response } from 'express'
import { configObj } from '../config.js'
import {
  BadRequest_400_Error,
  Forbidden_403_Error,
  NotFound_404_Error,
  Unauthorized_401_Error,
} from '../error-classes.js'

export const LogResponsesMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.on('finish', () => {
    if (res.statusCode === 200) {
      console.log(`[OK] ${req.method} ${req.url} `)
    }
    console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
  })
  next()
}

export const MetricsIncrementMiddleware = (
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  configObj.api.fileserverHits += 1
  next()
}

export const errorHandlerMiddleware = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err)
  }
  if (err instanceof BadRequest_400_Error) {
    res.status(400).json({ error: err.message })
  } else if (err instanceof Unauthorized_401_Error) {
    res.status(401).json({ error: err.message })
  } else if (err instanceof Forbidden_403_Error) {
    res.status(403).json({ error: err.message })
  } else if (err instanceof NotFound_404_Error) {
    res.status(404).json({ error: err.message })
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}
