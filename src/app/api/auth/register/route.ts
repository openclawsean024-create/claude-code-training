// Claude Code Training — POST /api/auth/register
// Sprint 2 Day 2 — 學員註冊
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, '密碼至少 8 字')
    .regex(/[A-Za-z]/, '密碼需含英文字母')
    .regex(/[0-9]/, '密碼需含數字'),
  name: z.string().min(1).max(100),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          code: 'VALIDATION_FAILED',
          message: '資料驗證失敗',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { email, password, name } = parsed.data

    // 檢查 email 是否已存在
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { code: 'EMAIL_TAKEN', message: 'Email 已被註冊' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'student',
        plan: 'free',
      },
    })

    // 設 cookie
    const token = signToken({ userId: user.id, email: user.email })
    const cookieStore = await cookies()
    cookieStore.set('cct_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    })

    return NextResponse.json({
      code: 'REGISTER_SUCCESS',
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}