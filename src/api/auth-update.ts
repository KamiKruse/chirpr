import { NextFunction, Request, Response } from 'express'
import { getBearerToken, hashPassword, validateJWT } from '../auth.js'
import {
  BadRequest_400_Error,
  Unauthorized_401_Error,
} from '../error-classes.js'
import { updateUser } from '../db/queries/update-users.js'
import { User } from '../schema.js'
import { configObj } from '../config.js'

type UserParams = {
  password: string
  email: string
}
export async function handlerAuthUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = getBearerToken(req)
    if (!accessToken) {
      throw new Unauthorized_401_Error('Not authorized')
    }
    const decodedUserID = validateJWT(accessToken, configObj.jwt.secret)
    const parsedBody: UserParams = req.body
    if (!parsedBody || !Object.hasOwn(parsedBody, 'email')) {
      throw new BadRequest_400_Error('Invalid request body')
    }
    if (!parsedBody || !Object.hasOwn(parsedBody, 'password')) {
      throw new BadRequest_400_Error('Invalid request body')
    }
    const hashedPassword = await hashPassword(parsedBody.password)

    const user = await updateUser(
      decodedUserID,
      parsedBody.email,
      hashedPassword
    )
    res.status(200).json(user satisfies User)
  } catch (error) {
    next(error)
  }
}
