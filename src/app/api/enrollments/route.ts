// Claude Code Training — POST /api/enrollments + GET
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

const EnrollSchema = z.object({
  courseId: z.string().min(1),
  stripePaymentId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const parsed = EnrollSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_FAILED', message: '資料驗證失敗' },
        { status: 400 }
      )
    }

    const { courseId, stripePaymentId } = parsed.data

    // 檢查課程存在
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json(
        { code: 'COURSE_NOT_FOUND', message: '課程不存在' },
        { status: 404 }
      )
    }

    // 建立或取得 enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      update: { stripePaymentId },
      create: {
        userId: user.id,
        courseId,
        stripePaymentId,
        status: 'active',
      },
    })

    return NextResponse.json({ code: 'ENROLLMENT_SUCCESS', enrollment })
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知錯誤'
    const status = message === 'AUTH_REQUIRED' ? 401 : 500
    return NextResponse.json({ code: message, message }, { status })
  }
}

export async function GET(_request: Request) {
  try {
    const user = await requireAuth()
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            level: true,
            price: true,
            duration: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    return NextResponse.json({ code: 'OK', enrollments })
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知錯誤'
    const status = message === 'AUTH_REQUIRED' ? 401 : 500
    return NextResponse.json({ code: message, message }, { status })
  }
}