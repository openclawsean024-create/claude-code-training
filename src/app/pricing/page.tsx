// Claude Code Training — /pricing
import Link from "next/link"
import { Check } from "lucide-react"

const TIERS = [
  {
    name: 'Free',
    price: 'NT$0',
    period: '永久',
    desc: '試看 1 堂基礎課',
    features: ['Lesson 1 完整觀看', '註冊帳號', '基礎 prompt 範例'],
    cta: '免費開始',
    highlight: false,
  },
  {
    name: 'Basic',
    price: 'NT$199',
    period: '/月',
    desc: '完整基礎 + 進階',
    features: ['Free 全部', '基礎 4 堂完整', '進階 Module A-C', '證書下載', 'Email 通知'],
    cta: '開始訂閱',
    highlight: true,
  },
  {
    name: 'Pro',
    price: 'NT$999',
    period: '/月',
    desc: '加值服務',
    features: ['Basic 全部', '每月 1 場 1對1 諮詢', '客製化 prompt 模板', '校友 LINE 群'],
    cta: '升級 Pro',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'NT$5 萬',
    period: '/堂',
    desc: '企業包班',
    features: ['客製化 4hr 課程', '10-50 人', '實體 + 線上', '結業證書', 'Q&A'],
    cta: '聯繫業務',
    highlight: false,
  },
  {
    name: 'Consulting',
    price: 'NT$10 萬',
    period: '/月',
    desc: '顧問服務',
    features: ['每週 2hr 會議', 'Slack 4hr SLA', '客製化 Claude Code 開發', 'AI 成熟度報告'],
    cta: '預約諮詢',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-semibold">Claude Code 內訓</span>
          </Link>
          <Link href="/courses" className="text-sm text-zinc-600 hover:text-zinc-900">瀏覽課程</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">5 種變現引擎</h1>
          <p className="text-zinc-600 dark:text-zinc-400">從個人學習到企業導入，總有一個適合你</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 ${
                t.highlight
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-transparent shadow-xl shadow-amber-500/20'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="mb-4">
                <h3 className={`text-lg font-bold mb-1 ${t.highlight ? '' : 'text-zinc-900 dark:text-white'}`}>{t.name}</h3>
                <p className={`text-sm ${t.highlight ? 'text-amber-50' : 'text-zinc-500'}`}>{t.desc}</p>
              </div>
              <div className="mb-6">
                <span className={`text-3xl font-bold ${t.highlight ? '' : 'text-zinc-900 dark:text-white'}`}>
                  {t.price}
                </span>
                <span className={`text-sm ${t.highlight ? 'text-amber-50' : 'text-zinc-500'}`}>{t.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${t.highlight ? '' : 'text-amber-500'}`} />
                    <span className={t.highlight ? '' : 'text-zinc-700 dark:text-zinc-300'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block w-full text-center py-2.5 rounded-lg font-medium text-sm transition ${
                  t.highlight
                    ? 'bg-white text-amber-600 hover:bg-amber-50'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90'
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-zinc-500">
          政府標案 NT$100 萬/標 · 聯繫業務 hello@claudecode-training.com.tw
        </div>
      </div>
    </main>
  )
}