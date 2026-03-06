import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-dev"

export function signJwt(payload: any, expiresIn: string | number = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any })
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as any
  } catch (error) {
    return null
  }
}
