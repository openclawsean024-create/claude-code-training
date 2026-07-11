// Claude Code Training — GET /api/courses + POST
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')

    const where: any = { published: true }
    if (level) where.level = level

    const courses = await prisma.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        level: true,
        price: true,
        duration: true,
        thumbnail: true,
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ code: 'OK', courses })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1).max(2000),
  level: z.enum(['basic', 'advanced', 'enterprise']),
  price: z.number().int().min(0).default(0),
  duration: z.number().int().min(0).default(0),
  thumbnail: z.string().url().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = CreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_FAILED', message: '資料驗證失敗' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: { ...parsed.data, published: false },
    })

    return NextResponse.json({ code: 'COURSE_CREATED', course })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}