// Claude Code Training — /courses
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { GraduationCap, Clock, Users, ChevronRight } from "lucide-react"

interface Course {
  id: string
  title: string
  slug: string
  description: string
  level: string
  price: number
  duration: number
  thumbnail?: string
  _count: { lessons: number; enrollments: number }
}

const LEVEL_NAMES: Record<string, string> = {
  basic: '基礎',
  advanced: '進階',
  enterprise: '企業',
}

const LEVEL_COLORS: Record<string, string> = {
  basic: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  enterprise: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => {
        setCourses(d.courses || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? courses : courses.filter((c) => c.level === filter)

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Claude Code 內訓</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">
            我的課程
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">課程總覽</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          從基礎 prompt 到企業導入，5 種變現引擎一次到位
        </p>

        {/* Filter */}
        <div className="flex gap-2 mb-8">
          {[
            { v: 'all', label: '全部' },
            { v: 'basic', label: '基礎' },
            { v: 'advanced', label: '進階' },
            { v: 'enterprise', label: '企業' },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.v
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-500">載入中…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <GraduationCap className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">目前沒有課程，敬請期待</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[course.level]}`}>
                    {LEVEL_NAMES[course.level]}
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {course.price === 0 ? '免費' : `NT$${course.price.toLocaleString()}`}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration} 分鐘
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course._count.enrollments} 人報名
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="flex items-center justify-between text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
                >
                  查看課程
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}