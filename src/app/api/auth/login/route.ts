// Claude Code Training — POST /api/auth/login
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const loginAttempts = new Map<string, { count: number; lockUntil: number }>()
const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_FAILED', message: '資料驗證失敗' },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const attempts = loginAttempts.get(email)
    if (attempts && attempts.lockUntil > Date.now()) {
      return NextResponse.json(
        {
          code: 'AUTH_LOCKED',
          message: `帳號鎖定中，請於 ${Math.ceil((attempts.lockUntil - Date.now()) / 60000)} 分鐘後再試`,
        },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.passwordHash) {
      recordFailedLogin(email)
      return NextResponse.json(
        { code: 'AUTH_INVALID', message: 'Email 或密碼錯誤' },
        { status: 401 }
      )
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      recordFailedLogin(email)
      return NextResponse.json(
        { code: 'AUTH_INVALID', message: 'Email 或密碼錯誤' },
        { status: 401 }
      )
    }

    loginAttempts.delete(email)

    const token = signToken({ userId: user.id, email: user.email })
    const cookieStore = await cookies()
    cookieStore.set('cct_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    })

    return NextResponse.json({
      code: 'LOGIN_SUCCESS',
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}

function recordFailedLogin(email: string) {
  const existing = loginAttempts.get(email)
  const count = (existing?.count || 0) + 1
  if (count >= MAX_ATTEMPTS) {
    loginAttempts.set(email, { count, lockUntil: Date.now() + LOCK_DURATION_MS })
  } else {
    loginAttempts.set(email, { count, lockUntil: 0 })
  }
}