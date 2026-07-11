// Claude Code Training — POST /api/lessons/[id]/progress
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

const Schema = z.object({
  enrollmentId: z.string().min(1),
  watched: z.number().int().min(0).default(0),
  completed: z.boolean().default(false),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id: lessonId } = await params
    const body = await request.json()
    const parsed = Schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_FAILED', message: '資料驗證失敗' },
        { status: 400 }
      )
    }

    const { enrollmentId, watched, completed } = parsed.data

    // 確認 enrollment 屬於當前用戶
    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, userId: user.id },
    })
    if (!enrollment) {
      return NextResponse.json(
        { code: 'ENROLLMENT_NOT_FOUND', message: '報名紀錄不存在' },
        { status: 404 }
      )
    }

    const progress = await prisma.progress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
      update: {
        watched: { increment: watched },
        completed: completed || undefined,
        completedAt: completed ? new Date() : undefined,
      },
      create: {
        enrollmentId,
        lessonId,
        watched,
        completed,
        completedAt: completed ? new Date() : undefined,
      },
    })

    return NextResponse.json({ code: 'OK', progress })
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知錯誤'
    const status = message === 'AUTH_REQUIRED' ? 401 : 500
    return NextResponse.json({ code: message, message }, { status })
  }
}