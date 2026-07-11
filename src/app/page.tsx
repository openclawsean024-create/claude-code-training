// Claude Code Training — main page
// Sprint 1 — 課程列表
import Link from "next/link"
import { GraduationCap, Sparkles, Building2, Users } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      {/* Nav */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Claude Code 內訓</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
              課程
            </Link>
            <Link href="/pricing" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
              定價
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90"
            >
              免費試看
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          純繁中 · Claude Code 專注 · 顧問服務
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          從 prompt 到企業導入
          <br />
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            最完整的 Claude Code 內訓
          </span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          5 種變現引擎：個人學習者 · 工程師訂閱 · 企業內訓 · 政府標案 · 顧問服務
          <br />
          從 NT$199/月 到 NT$100 萬/標，一次滿足
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/courses"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90 shadow-lg shadow-amber-500/20"
          >
            瀏覽課程
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            查看定價
          </Link>
        </div>
      </section>

      {/* 5 Engines */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">5 種變現引擎</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: GraduationCap, label: '個人學習者', price: 'NT$499', desc: '4 堂基礎課' },
            { icon: Sparkles, label: '工程師訂閱', price: 'NT$199/月', desc: '進階內容' },
            { icon: Building2, label: '企業內訓', price: 'NT$5 萬/堂', desc: '客製化 4hr' },
            { icon: Users, label: '政府標案', price: 'NT$100 萬/標', desc: 'AI 轉型' },
            { icon: Sparkles, label: '顧問服務', price: 'NT$10 萬/月', desc: '客製導入' },
          ].map((e, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center hover:shadow-lg transition">
              <e.icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="font-semibold mb-1">{e.label}</div>
              <div className="text-amber-600 dark:text-amber-400 font-bold text-sm mb-2">{e.price}</div>
              <div className="text-xs text-zinc-500">{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: 'NT$4.61 億', label: '潛在 ARR' },
            { num: '5 萬', label: 'AI 工程師' },
            { num: '500 家', label: '企業內訓目標' },
            { num: 'LTV/CAC 36', label: '健康 SaaS' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {s.num}
              </div>
              <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500">
          © 2026 Claude Code Training · Sean Li · 純繁中 AI 內訓
        </div>
      </footer>
    </main>
  )
}