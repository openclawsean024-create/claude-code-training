// Claude Code Training — GET /api/courses/[id]
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const course = await prisma.course.findFirst({
      where: { OR: [{ id }, { slug: id }], published: true },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true,
          },
        },
        _count: { select: { enrollments: true } },
      },
    })

    if (!course) {
      return NextResponse.json(
        { code: 'COURSE_NOT_FOUND', message: '課程不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ code: 'OK', course })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}