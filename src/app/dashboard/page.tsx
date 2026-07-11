// Claude Code Training — /dashboard
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, BookOpen, Award, TrendingUp, LogOut } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (r) => {
        if (!r.ok) {
          if (r.status === 401) router.push("/login")
          return
        }
        return r.json()
      })
      .then((d) => {
        if (d) setData(d.dashboard)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [router])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-zinc-500">載入中…</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Claude Code 內訓</span>
          </Link>
          <button onClick={logout} className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5">
            <LogOut className="w-4 h-4" />
            登出
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 text-sm rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          歡迎回來{data?.user?.name ? `，${data.user.name}` : ""}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          方案：<span className="font-semibold text-amber-600">{data?.user?.plan || "free"}</span>
        </p>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Metric icon={BookOpen} label="已報名課程" value={data.recentEnrollments?.length || 0} color="from-amber-500 to-orange-500" />
            <Metric icon={TrendingUp} label="完成課程" value={data.completedCount} color="from-emerald-500 to-green-500" />
            <Metric icon={Award} label="已取得證書" value={data.certificatesCount} color="from-purple-500 to-pink-500" />
            <Metric icon={GraduationCap} label="平台課程總數" value={data.totalCourses} color="from-blue-500 to-cyan-500" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/courses" className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition">
            <BookOpen className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-semibold mb-1">瀏覽課程</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">查看所有可報名的 Claude Code 課程</p>
          </Link>

          <Link href="/pricing" className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition">
            <TrendingUp className="w-8 h-8 text-emerald-500 mb-3" />
            <h3 className="font-semibold mb-1">升級方案</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">升級到 Pro / Enterprise / 顧問</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className={`inline-flex w-10 h-10 rounded-lg bg-gradient-to-br ${color} items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{label}</div>
    </div>
  )
}