import { useEffect, useMemo, useRef, useState } from 'react'

type AppStatus = 'active' | 'disabled'

type PortalApp = {
  id: string
  name: string
  description: string
  keywords: string[]
  status: AppStatus
  href: string
  icon: (className: string) => JSX.Element
  iconBg: string
  iconColor: string
}

const iconUsers = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
)

const iconCart = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="9" cy="20" r="1.6" />
    <circle cx="17" cy="20" r="1.6" />
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L21 7H6.2" />
  </svg>
)

const iconMeal = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 3v7a3 3 0 0 0 6 0V3" />
    <path d="M8 3v7" />
    <path d="M14 3v9a4 4 0 0 0 4 4h2" />
  </svg>
)

const iconCpu = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
  </svg>
)

const iconWallet = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 7a3 3 0 0 1 3-3h11a2 2 0 0 1 2 2v1" />
    <path d="M3 9h18a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3Z" />
    <circle cx="17" cy="14" r="1" />
  </svg>
)

const iconClipboard = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="8" y="3" width="8" height="4" rx="1" />
    <path d="M6 7h12a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
  </svg>
)

const iconChart = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19h16" />
    <path d="M7 16V9" />
    <path d="M12 16V5" />
    <path d="M17 16v-6" />
  </svg>
)

const iconCalendar = (className: string) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M7 3v4M17 3v4M3 11h18" />
  </svg>
)

const portalApps: PortalApp[] = [
  {
    id: 'meal',
    name: 'Đăng ký suất ăn',
    description: 'Đặt suất ăn hàng ngày và theo dõi lịch giao.',
    keywords: ['com', 'meal', 'suat an', 'suat', 'an', 'canteen'],
    status: 'active',
    href: '#meal',
    icon: iconMeal,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'hrm',
    name: 'HRM',
    description: 'Quản lý nhân sự, nghỉ phép và hồ sơ.',
    keywords: ['nhan su', 'nhansu', 'luong', 'hr', 'hrm', 'nhan vien'],
    status: 'active',
    href: 'http://27.71.16.15/hr/',
    icon: iconUsers,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    id: 'purchasing',
    name: 'Mua hàng',
    description: 'Yêu cầu và theo dõi tiến độ mua sắm.',
    keywords: ['mua', 'hang', 'po', 'pr', 'ncc', 'procurement'],
    status: 'active',
    href: '#purchasing',
    icon: iconCart,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    id: 'it-helpdesk',
    name: 'IT Helpdesk',
    description: 'Gửi yêu cầu hỗ trợ kỹ thuật nội bộ.',
    keywords: ['it', 'helpdesk', 'support', 'ticket', 'ky thuat'],
    status: 'active',
    href: '#it-helpdesk',
    icon: iconCpu,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 'finance',
    name: 'Tài chính',
    description: 'Theo dõi chi phí và phê duyệt ngân sách.',
    keywords: ['finance', 'tai chinh', 'chi phi', 'ngan sach', 'budget'],
    status: 'active',
    href: '#finance',
    icon: iconWallet,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'timesheet',
    name: 'Timesheet',
    description: 'Chấm công và báo cáo thời gian làm việc.',
    keywords: ['timesheet', 'cham cong', 'cong', 'time', 'bao cao'],
    status: 'active',
    href: '#timesheet',
    icon: iconClipboard,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Bảng điều khiển KPI và hiệu suất.',
    keywords: ['analytics', 'kpi', 'report', 'bao cao', 'hieu suat'],
    status: 'disabled',
    href: '#analytics',
    icon: iconChart,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
  },
  {
    id: 'calendar',
    name: 'Lịch họp',
    description: 'Đặt phòng họp và quản lý lịch làm việc.',
    keywords: ['calendar', 'lich', 'hop', 'meeting', 'room'],
    status: 'active',
    href: '#calendar',
    icon: iconCalendar,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
]

const skeletonCards = Array.from({ length: 8 }, (_, index) => index)

function App() {
  const [query, setQuery] = useState('')
  const [apps, setApps] = useState<PortalApp[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [now, setNow] = useState(() => new Date())
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [navigatingId, setNavigatingId] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setApps(portalApps)
      setIsLoading(false)
    }, 650)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) {
        return
      }
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, [contenteditable="true"]')) {
        return
      }
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const timeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now),
    [now],
  )

  const filteredApps = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return apps
    const tokens = keyword.split(/\s+/).filter(Boolean)
    return apps.filter((app) => {
      const haystack = [
        app.name,
        app.description,
        app.keywords.join(' '),
      ]
        .join(' ')
        .toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })
  }, [apps, query])

  const handleAppClick = (app: PortalApp) => {
    if (app.status === 'disabled') return
    setNavigatingId(app.id)
    setTimeout(() => {
      window.location.href = app.href
    }, 180)
  }

  return (
    <div className="flex min-h-screen flex-col bg-page text-title">
      <header className="sticky top-0 z-20 h-16 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6">
          <button
            type="button"
            className="group flex items-center gap-3 text-sm font-semibold text-slate-900"
            aria-label="RMG Vietnam"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:scale-105">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                <path d="M4 7v6l8 4 8-4V7" />
                <path d="M12 11v6" />
              </svg>
            </span>
            <span className="tracking-tight">RMG Vietnam</span>
          </button>

          <div className="relative hidden md:block">
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search application..."
              aria-label="Search application"
              className="mx-auto w-full max-w-[560px] rounded-full border border-slate-200/80 bg-white/90 px-12 py-2.5 text-sm text-slate-700 shadow-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm sm:inline-flex">
              {timeLabel}
            </div>
            <div className="hidden items-center gap-2 text-xs text-slate-500 lg:flex">
              <span className="font-semibold text-slate-700">Xin chào,</span>
              <span>Nguyễn Văn A</span>
              <span className="text-slate-400">•</span>
              <span>IT Department</span>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-primary hover:text-primary"
              aria-label="Notifications"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 17H9a4 4 0 0 1-4-4V9a7 7 0 1 1 14 0v4a4 4 0 0 1-4 4Z" />
                <path d="M10 21a2 2 0 0 0 4 0" />
              </svg>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-primary"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                NA
              </span>
              <span className="hidden sm:inline">Nguyễn Văn A</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-12">
        <section className="mb-10">
          <p className="text-sm font-semibold text-primary">Company Applications</p>
          <h1 className="mt-2 text-3xl font-semibold text-title">
            Company Applications
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Select an app to start working.
          </p>
        </section>

        <div className="mb-6 md:hidden">
          <div className="relative">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search application..."
              aria-label="Search application"
              className="w-full rounded-full border border-slate-200 bg-white px-12 py-2.5 text-sm text-slate-700 shadow-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
        </div>

        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {skeletonCards.map((item) => (
                <div
                  key={item}
                  className="h-[176px] rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-full animate-pulse flex-col items-center justify-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                    <div className="h-3 w-24 rounded-full bg-slate-200" />
                    <div className="h-2 w-32 rounded-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-title">
                No applications found
              </h2>
              <p className="mt-1 text-sm text-muted">
                Try a different keyword or clear the search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  disabled={app.status === 'disabled'}
                  className={`app-card group relative flex h-[176px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-card p-5 text-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    app.status === 'disabled'
                      ? 'cursor-not-allowed border-dashed opacity-50'
                      : 'app-float hover:-translate-y-2 hover:border-primary hover:shadow-card hover:shadow-blue-200/60 active:scale-[0.95]'
                  } ${navigatingId === app.id ? 'scale-[0.96] opacity-80' : ''}`}
                  title={app.description}
                  onClick={() => handleAppClick(app)}
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 ${app.iconBg} ${app.iconColor} group-hover:scale-125 group-hover:-rotate-6`}
                  >
                    {app.icon('h-7 w-7')}
                  </span>
                  <span className="mt-1 text-base font-semibold text-title">
                    {app.name}
                  </span>
                  <span className="text-sm text-muted">
                    {app.description}
                  </span>
                  {app.status === 'disabled' && (
                    <span className="mt-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      Coming soon
                    </span>
                  )}
                  <span className="pointer-events-none absolute -top-9 left-1/2 w-max -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    {app.description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-200/80 bg-white/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Version 1.0.0</span>
          <span>Status: All systems operational</span>
        </div>
      </footer>
    </div>
  )
}

export default App
