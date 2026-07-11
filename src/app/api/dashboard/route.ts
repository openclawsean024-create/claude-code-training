// Claude Code Training — GET /api/dashboard
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(_request: Request) {
  try {
    const user = await requireAuth()

    const [enrollments, completedCount, certificatesCount, totalCourses] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: user.id },
        include: { course: true, progress: true },
        orderBy: { enrolledAt: 'desc' },
        take: 5,
      }),
      prisma.enrollment.count({
        where: { userId: user.id, status: 'completed' },
      }),
      prisma.certificate.count({ where: { userId: user.id } }),
      prisma.course.count({ where: { published: true } }),
    ])

    return NextResponse.json({
      code: 'OK',
      dashboard: {
        user: { id: user.id, name: user.name, plan: user.plan },
        recentEnrollments: enrollments,
        completedCount,
        certificatesCount,
        totalCourses,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知錯誤'
    const status = message === 'AUTH_REQUIRED' ? 401 : 500
    return NextResponse.json({ code: message, message }, { status })
  }
}