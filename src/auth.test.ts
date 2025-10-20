import { describe, it, expect, beforeAll, vi } from 'vitest'
import { getBearerToken, makeJWT, validateJWT } from './auth.js'
import { Unauthorized_401_Error } from './error-classes.js'
import { Request } from 'express'
import { handlerUserLogin } from './api/user-login.js'

describe('JWT Testing', () => {
  let token: string
  let userId = 'testUser1'
  let expiresIn = 120
  let secret = 'himitsu'

  beforeAll(() => {
    token = makeJWT(userId, expiresIn, secret)
  })

  it('should return true for the correct token', () => {
    const result = validateJWT(token, secret)
    expect(result).toContain(userId)
  })

  it('should return 401 for incorrect token', () => {
    expect(() => validateJWT('wrongToken', secret)).toThrow(
      Unauthorized_401_Error
    )
  })

  it('should return 401 for invalid secret', () => {
    expect(() => validateJWT(token, 'wrongSecret')).toThrow(
      Unauthorized_401_Error
    )
  })
})

describe('Auth Testing', () => {
  const mockRequest = (authHeader?: string): Partial<Request> => ({
    get: vi.fn((headerName: string) => {
      if (headerName.toLowerCase() === 'authorization') {
        return authHeader
      }
      if (headerName.toLowerCase() === 'set-cookie') {
        return undefined 
      }
      return undefined
    }) as Request['get'],
  })
  it('should return the token', () => {
    let bearerToken = 'jwtToken'
    const request = mockRequest(`Bearer ${bearerToken}`)
    const result = getBearerToken(request as Request)
    expect(result).toBe(bearerToken)
    expect((request as any).get).toHaveBeenCalledWith('Authorization')
  })
})
