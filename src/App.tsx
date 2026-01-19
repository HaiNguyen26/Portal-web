import { useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import rmgLogo from './assets/RMg.png'

type AppStatus = 'active' | 'disabled'

type PortalApp = {
  id: string
  name: string
  description: string
  keywords: string[]
  status: AppStatus
  href: string
  icon: (className: string) => React.ReactElement
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

const portalGroups: { id: string; title: string; apps: PortalApp[] }[] = [
  {
    id: 'core',
    title: 'Ứng dụng cốt lõi',
    apps: [
      {
        id: 'meal',
        name: 'Đăng ký suất ăn',
        description: 'Đặt suất ăn hàng ngày và theo dõi lịch giao.',
        keywords: ['com', 'meal', 'suat an', 'suat', 'an', 'canteen'],
        status: 'active',
        href: 'http://27.71.16.15/meals-rmg/login',
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
        id: 'procurement',
        name: 'Mua Sắm & Vật Tư',
        description: 'Yêu cầu mua sắm và theo dõi vật tư.',
        keywords: ['mua sam', 'vat tu', 'procurement', 'po', 'pr'],
        status: 'disabled',
        href: '#procurement',
        icon: iconCart,
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
      },
      {
        id: 'asset-management',
        name: 'Quản Lý Tài Sản',
        description: 'Theo dõi tài sản và cấp phát thiết bị.',
        keywords: ['tai san', 'asset', 'equipment', 'cap phat'],
        status: 'disabled',
        href: '#asset-management',
        icon: iconWallet,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
      },
      {
        id: 'calendar',
        name: 'Lịch Họp & Sự Kiện',
        description: 'Đặt phòng họp và quản lý lịch sự kiện.',
        keywords: ['lich hop', 'su kien', 'calendar', 'meeting', 'room'],
        status: 'disabled',
        href: '#calendar',
        icon: iconCalendar,
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
      },
      {
        id: 'it-support',
        name: 'Hỗ Trợ Kỹ Thuật (IT Support)',
        description: 'Gửi ticket hỗ trợ và theo dõi xử lý.',
        keywords: ['it', 'support', 'ticket', 'helpdesk', 'ky thuat'],
        status: 'disabled',
        href: '#it-support',
        icon: iconCpu,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Nhóm hành chính – văn phòng',
    apps: [
      {
        id: 'e-approval',
        name: 'Trình Ký Điện Tử',
        description: 'Ký số và phê duyệt hồ sơ nhanh chóng.',
        keywords: ['trinh ky', 'e-sign', 'approval', 'ky so'],
        status: 'disabled',
        href: '#e-approval',
        icon: iconClipboard,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
      {
        id: 'document-management',
        name: 'Quản Lý Văn Bản & Tài Liệu',
        description: 'Lưu trữ văn bản và tài liệu nội bộ.',
        keywords: ['van ban', 'tai lieu', 'document', 'storage'],
        status: 'disabled',
        href: '#document-management',
        icon: iconChart,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
      },
      {
        id: 'process-forms',
        name: 'Quy Trình & Biểu Mẫu',
        description: 'Chuẩn hóa quy trình và biểu mẫu.',
        keywords: ['quy trinh', 'bieu mau', 'process', 'form'],
        status: 'disabled',
        href: '#process-forms',
        icon: iconClipboard,
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
      },
      {
        id: 'internal-communications',
        name: 'Thông Báo & Truyền Thông Nội Bộ',
        description: 'Cập nhật thông tin và truyền thông nội bộ.',
        keywords: ['thong bao', 'truyen thong', 'news', 'communications'],
        status: 'disabled',
        href: '#internal-communications',
        icon: iconUsers,
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-500',
      },
    ],
  },
  {
    id: 'operations',
    title: 'Nhóm vận hành – kho – sản xuất',
    apps: [
      {
        id: 'warehouse-management',
        name: 'Quản Lý Kho',
        description: 'Kiểm soát nhập xuất và tồn kho.',
        keywords: ['kho', 'ton kho', 'warehouse', 'inventory'],
        status: 'disabled',
        href: '#warehouse-management',
        icon: iconCart,
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
      },
      {
        id: 'production-planning',
        name: 'Sản Xuất & Kế Hoạch',
        description: 'Lập kế hoạch và theo dõi sản xuất.',
        keywords: ['san xuat', 'ke hoach', 'production', 'planning'],
        status: 'disabled',
        href: '#production-planning',
        icon: iconCpu,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
      },
      {
        id: 'maintenance',
        name: 'Bảo Trì & Cơ Khí',
        description: 'Bảo trì thiết bị và xử lý sự cố.',
        keywords: ['bao tri', 'co khi', 'maintenance', 'repair'],
        status: 'disabled',
        href: '#maintenance',
        icon: iconWallet,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
      },
      {
        id: 'equipment-management',
        name: 'Quản Lý Thiết Bị – Máy Móc',
        description: 'Theo dõi thiết bị và lịch vận hành.',
        keywords: ['thiet bi', 'may moc', 'equipment', 'machine'],
        status: 'disabled',
        href: '#equipment-management',
        icon: iconCpu,
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
      },
    ],
  },
  {
    id: 'employee',
    title: 'Nhóm nhân viên – trải nghiệm',
    apps: [
      {
        id: 'employee-profile',
        name: 'Thông Tin Cá Nhân Nhân Viên',
        description: 'Cập nhật hồ sơ và thông tin cá nhân.',
        keywords: ['thong tin', 'ca nhan', 'profile', 'employee'],
        status: 'disabled',
        href: '#employee-profile',
        icon: iconUsers,
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
      },
      {
        id: 'internal-training',
        name: 'Đào Tạo & Hướng Dẫn Nội Bộ',
        description: 'Khoá học và hướng dẫn nội bộ.',
        keywords: ['dao tao', 'huong dan', 'training', 'learning'],
        status: 'disabled',
        href: '#internal-training',
        icon: iconChart,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
      },
      {
        id: 'suggestions',
        name: 'Đề Xuất & Góp Ý',
        description: 'Gửi góp ý và đề xuất cải tiến.',
        keywords: ['de xuat', 'gop y', 'suggestion', 'feedback'],
        status: 'disabled',
        href: '#suggestions',
        icon: iconClipboard,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
      },
    ],
  },
]

const portalApps = portalGroups.flatMap((group) => group.apps)

function App() {
  const [query, setQuery] = useState('')
  const [apps] = useState<PortalApp[]>(portalApps)
  const [now, setNow] = useState(() => new Date())
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [navigatingId, setNavigatingId] = useState<string | null>(null)
  const [activeGroupId, setActiveGroupId] = useState('all')

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

  const onlineApps = useMemo(
    () => filteredApps.filter((app) => app.status === 'active'),
    [filteredApps],
  )

  const handleAppClick = (app: PortalApp) => {
    if (app.status === 'disabled') return
    setNavigatingId(app.id)
    setTimeout(() => {
      window.location.href = app.href
    }, 180)
  }

  return (
    <div className="flex min-h-screen flex-col bg-page text-title">
      <header className="sticky top-0 z-20 h-16 border-b border-slate-200/70 bg-white/80 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6">
          <button
            type="button"
            className="group flex items-center gap-3 text-sm font-semibold text-slate-900"
            aria-label="RMG Vietnam"
          >
            <span className="relative flex h-14 w-24 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 transition group-hover:scale-105">
              <img
                src={rmgLogo}
                alt="RMG"
                className="h-10 w-20 object-contain"
              />
            </span>
            <span className="text-base font-semibold tracking-tight">
              RMG Portal
            </span>
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
            <div className="hidden items-center gap-2 rounded-full border border-slate-200/70 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)] sm:inline-flex">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              {timeLabel}
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
          </div>
        </div>
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-12">
        <section className="fade-step mb-10" style={{ animationDelay: '40ms' }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
            Company Portal
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-4xl font-semibold text-title">Ứng dụng nội bộ</h1>
            <p className="text-base font-semibold uppercase tracking-[0.2em] text-slate-400">
              Think SMT - Think <span className="text-primary">RMG</span>
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-base text-muted">
            Truy cập các hệ thống làm việc của công ty
          </p>
        </section>
        <section
          className="fade-step mb-8 flex flex-wrap gap-3 showscrollbar"
          style={{ animationDelay: '120ms' }}
        >
          {[
            { id: 'all', title: 'Tất cả' },
            { id: 'online', title: 'Đang online' },
            ...portalGroups.map((group) => ({
              id: group.id,
              title: group.title,
            })),
          ].map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveGroupId(group.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                activeGroupId === group.id
                  ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-[0_10px_20px_rgba(37,99,235,0.35)]'
                  : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[0_10px_20px_rgba(15,23,42,0.1)]'
              }`}
            >
              {group.title}
            </button>
          ))}
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
          {filteredApps.length === 0 ? (
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
            <div key={activeGroupId} className="space-y-10">
              {(activeGroupId === 'all' || activeGroupId === 'online') &&
                onlineApps.length > 0 && (
                  <section
                    className="fade-step"
                    style={{ animationDelay: '200ms' }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                        Đang online
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {onlineApps.map((app, index) => (
                        <div
                          key={app.id}
                          className="fade-step"
                          style={{
                            animationDelay: `${260 + index * 60}ms`,
                          }}
                        >
                          <button
                            type="button"
                            disabled={app.status === 'disabled'}
                            className={`app-card group relative flex h-[176px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-card p-5 text-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                              app.status === 'disabled'
                                ? 'cursor-not-allowed border-dashed opacity-50'
                                : 'cursor-pointer app-float hover:-translate-y-2 hover:border-primary hover:shadow-card hover:shadow-blue-200/60 active:scale-[0.95]'
                            } ${navigatingId === app.id ? 'scale-[0.96] opacity-80' : ''}`}
                            title={app.description}
                            onClick={() => handleAppClick(app)}
                          >
                          {app.status === 'active' && (
                            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                              </span>
                              Online
                            </span>
                          )}
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
                          {navigatingId === app.id && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
                              <span className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                                Đang chuyển...
                              </span>
                            </span>
                          )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              {portalGroups.map((group) => {
                if (
                  activeGroupId !== 'all' &&
                  activeGroupId !== group.id &&
                  activeGroupId !== 'online'
                ) {
                  return null
                }
                const isShowingOnlineOnly = activeGroupId === 'online'
                const groupApps = isShowingOnlineOnly
                  ? group.apps.filter((app) => app.status === 'active')
                  : activeGroupId === 'all'
                    ? group.apps.filter((app) => app.status !== 'active')
                    : group.apps
                const visibleApps = groupApps.filter((app) =>
                  filteredApps.some((filtered) => filtered.id === app.id),
                )
                if (visibleApps.length === 0) return null
                return (
                  <section
                    key={group.id}
                    className="fade-step"
                    style={{ animationDelay: '200ms' }}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                        {group.title}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {visibleApps.map((app, index) => (
                        <div
                          key={app.id}
                          className="fade-step"
                          style={{
                            animationDelay: `${260 + index * 60}ms`,
                          }}
                        >
                          <button
                            type="button"
                            disabled={app.status === 'disabled'}
                            className={`app-card group relative flex h-[176px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-card p-5 text-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                              app.status === 'disabled'
                                ? 'cursor-not-allowed border-dashed opacity-50'
                                : 'cursor-pointer app-float hover:-translate-y-2 hover:border-primary hover:shadow-card hover:shadow-blue-200/60 active:scale-[0.95]'
                            } ${navigatingId === app.id ? 'scale-[0.96] opacity-80' : ''}`}
                            title={app.description}
                            onClick={() => handleAppClick(app)}
                          >
                          {app.status === 'active' && (
                            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                              </span>
                              Online
                            </span>
                          )}
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
                          {navigatingId === app.id && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
                              <span className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                                Đang chuyển...
                              </span>
                            </span>
                          )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
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
