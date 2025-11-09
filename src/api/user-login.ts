import type { Request, Response, NextFunction } from 'express'
import {
  BadRequest_400_Error,
  NotFound_404_Error,
  Unauthorized_401_Error,
} from '../error-classes.js'
import { checkPassword, makeJWT, makeRefreshToken } from '../auth.js'
import { userExists } from '../db/queries/read-user.js'
import { configObj } from '../config.js'
import { createRefreshTokens } from '../db/queries/create-refresh-token.js'

export async function handlerUserLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  type LoginParams = {
    password: string
    email: string
  }
  try {
    const parsedBody: LoginParams = req.body
    if (!parsedBody || !Object.hasOwn(parsedBody, 'email')) {
      throw new BadRequest_400_Error('Invalid request body')
    }
    if (!parsedBody || !Object.hasOwn(parsedBody, 'password')) {
      throw new BadRequest_400_Error('Invalid request body')
    }

    const returnedUser = await userExists(parsedBody.email)

    if (!returnedUser) {
      throw new NotFound_404_Error('User not found')
    }

    const verified = await checkPassword(
      parsedBody.password,
      returnedUser.hashedPassword
    )

    const { hashedPassword: _omit, ...response } = returnedUser as any

    if (verified) {
      const jwtToken = makeJWT(
        returnedUser.id,
        configObj.jwt.defaultDuration,
        configObj.jwt.secret
      )
      const refreshToken = makeRefreshToken()
      const refreshTokenDB = await createRefreshTokens(
        refreshToken,
        returnedUser.id
      )
      if (!refreshTokenDB) {
        throw new Unauthorized_401_Error('could not save refresh token')
      }
      const updatedResponse = {
        ...response,
        token: jwtToken,
        refreshToken: refreshToken,
      }
      res.status(200).json(updatedResponse)
    } else {
      throw new Unauthorized_401_Error('Incorrect email or password')
    }
  } catch (error) {
    next(error)
  }
}
