import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatNumber } from '@/lib/utils'
import { Link2, MousePointerClick, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  const [linksCount, totalClicks, recentLinks] = await Promise.all([
    prisma.link.count({ where: { userId } }),
    prisma.click.count({ where: { link: { userId } } }),
    prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { _count: { select: { clicks: true } } },
    }),
  ])

  // Clicks in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentClicks = await prisma.click.count({
    where: { link: { userId }, createdAt: { gte: sevenDaysAgo } },
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Обзор</h1>
        <p className="text-muted text-sm mt-1">Статистика вашего аккаунта</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего ссылок', value: formatNumber(linksCount), icon: Link2 },
          { label: 'Всего кликов', value: formatNumber(totalClicks), icon: MousePointerClick },
          { label: 'Кликов за 7 дней', value: formatNumber(recentClicks), icon: TrendingUp },
          {
            label: 'Среднее на ссылку',
            value: linksCount ? formatNumber(Math.round(totalClicks / linksCount)) : '—',
            icon: Clock,
          },
        ].map((s, i) => (
          <div key={i} className="card">
            <s.icon className="w-4 h-4 text-accent mb-3" />
            <div className="text-2xl font-black tracking-tight">{s.value}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono text-muted uppercase tracking-widest">
            Последние ссылки
          </h2>
          <Link href="/dashboard/links" className="text-xs text-accent hover:underline">
            Все ссылки →
          </Link>
        </div>

        {recentLinks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted text-sm">Ещё нет ссылок</p>
            <Link href="/dashboard/links" className="btn-primary inline-block mt-4 text-sm">
              Создать первую
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLinks.map((link) => (
              <Link
                key={link.id}
                href={`/dashboard/links/${link.id}`}
                className="card flex items-center gap-4 hover:border-accent/40 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-accent text-sm">
                    {appUrl}/{link.slug}
                  </div>
                  <div className="text-xs text-muted truncate mt-0.5">
                    {link.originalUrl}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black">{link._count.clicks}</div>
                  <div className="text-xs text-muted">кликов</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
