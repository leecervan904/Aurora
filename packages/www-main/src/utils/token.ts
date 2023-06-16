import jwt from 'jsonwebtoken'

export const ACCESS_TOKEN_SECRET = 'iteheima No1 φ(*￣0￣)'
export const REFRESH_TOKEN_SECRET = 'iteheima No2 φ(*￣0￣)'

export function generateAccessToken(username, expiresIn = '1d') {
  return jwt.sign({ username }, ACCESS_TOKEN_SECRET, { expiresIn })
}

export function generateRefreshToken(username, expiresIn = '7d') {
  return jwt.sign({ username }, REFRESH_TOKEN_SECRET, { expiresIn })
}

export function getAuthorizationToken(authorization) {
  let token = null
  if (authorization && authorization.split(' ')[0] === 'Bearer')
    token = authorization.split(' ')[1]
  return token
}
