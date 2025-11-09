import { NextFunction, Request, Response } from 'express'
import { BadRequest_400_Error, NotFound_404_Error, Unauthorized_401_Error } from '../error-classes.js'
import { upgradeUserToRed } from '../db/queries/chirpy-red-upgrade.js'
import { getAPIKey } from '../auth.js'
import { configObj } from '../config.js'
type PolkaWebHook = {
  event: string
  data: {
    userId: string
  }
}
function isPolkaWebHook(body: unknown): body is PolkaWebHook {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as PolkaWebHook).event === 'string' &&
    typeof (body as PolkaWebHook).data === 'object' &&
    (body as PolkaWebHook).data !== null &&
    typeof (body as PolkaWebHook).data.userId === 'string'
  )
}
export async function handlerPolkaWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!isPolkaWebHook(req.body)) {
      throw new BadRequest_400_Error('Invalid webhook payload')
    }
    const apiAuth = getAPIKey(req) 
    if(apiAuth !== configObj.api.apiKey){
      throw new Unauthorized_401_Error("Unauthorized to access this webhook")
    }
    if (req.body.event !== 'user.upgraded') {
      return res.sendStatus(204)
    } else {
      const upgradedStatus = await upgradeUserToRed(req.body.data.userId)
      if (!upgradedStatus) {
        throw new NotFound_404_Error('User not found')
      }
      return res.sendStatus(204)
    }
  } catch (error) {
    next(error)
  }
}
