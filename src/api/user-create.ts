import type { Request, Response, NextFunction } from 'express'
import { createUser } from '../db/queries/users.js'
import { BadRequest_400_Error } from '../error-classes.js'
import { hashPassword } from '../auth.js'


export const handlerUserCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  type EmailParams = {
    password: string,
    email: string
  }
  try {
    const parsedBody: EmailParams = req.body
    if (!parsedBody || !Object.hasOwn(parsedBody, 'password')) {
      throw new BadRequest_400_Error('Invalid request body')
    }
    if (!parsedBody || !Object.hasOwn(parsedBody, 'email')) {
      throw new BadRequest_400_Error('Invalid request body')
    }
    const hashedPassword = await hashPassword(parsedBody.password)
    const toInsert = {email:parsedBody.email, hashedPassword}
    const response = await createUser(toInsert)
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
}
