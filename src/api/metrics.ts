import type { Request, Response } from 'express'
import { configObj } from '../config.js'
export const handlerMetricReadout = (_: Request, res: Response): void => {
  res.set({
    'Content-Type': 'text/html',
    charset: 'utf-8',
  })
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${configObj.fileserverHits} times!</p>
  </body>
</html>`)
}
