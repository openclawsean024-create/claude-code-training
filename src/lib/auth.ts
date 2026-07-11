// Claude Code Training — Auth helpers（簡化版，bcrypt + 自家 JWT）
import { cookies } from 'next/headers'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me-2026'

// 簡化版 token：base64(email + expiry + signature)
function signToken(payload: { userId: string; email: string }): string {
  const data = `${payload.userId}:${payload.email}:${Date.now() + 7 * 24 * 3600 * 1000}`
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('hex')
  return Buffer.from(`${data}:${sig}`).toString('base64url')
}

function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const parts = decoded.split(':')
    if (parts.length !== 4) return null
    const [userId, email, expiryStr, sig] = parts
    const expiry = parseInt(expiryStr)
    if (Date.now() > expiry) return null
    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(`${userId}:${email}:${expiryStr}`)
      .digest('hex')
    if (sig !== expectedSig) return null
    return { userId, email }
  } catch {
    return null
  }
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: string
  plan: string
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('cct_session')?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, plan: true },
  })
  return user
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession()
  if (!user) throw new Error('AUTH_REQUIRED')
  return user
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export { signToken }