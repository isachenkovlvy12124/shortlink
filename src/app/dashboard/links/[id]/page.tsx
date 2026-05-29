import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { LinkStats } from '@/components/LinkStats'

interface Props {
  params: { id: string }
}

export default async function LinkDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  const link = await prisma.link.findFirst({
    where: { id: params.id, userId },
    include: {
      clicks: {
        orderBy: { createdAt: 'desc' },
        take: 500,
      },
    },
  })

  if (!link) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Aggregate stats
  const countryStats = link.clicks.reduce<Record<string, number>>((acc, c) => {
    const key = c.country || 'Неизвестно'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const deviceStats = link.clicks.reduce<Record<string, number>>((acc, c) => {
    const key = c.device || 'Неизвестно'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const browserStats = link.clicks.reduce<Record<string, number>>((acc, c) => {
    const key = c.browser || 'Неизвестно'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Daily clicks for last 14 days
  const dailyMap: Record<string, number> = {}
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    dailyMap[key] = 0
  }
  link.clicks.forEach((c) => {
    const key = new Date(c.createdAt).toISOString().split('T')[0]
    if (key in dailyMap) dailyMap[key]++
  })

  const dailyData = Object.entries(dailyMap).map(([date, count]) => ({ date, count }))

  return (
    <LinkStats
      link={{
        ...link,
        createdAt: link.createdAt.toISOString(),
        expiresAt: link.expiresAt?.toISOString() || null,
      }}
      appUrl={appUrl}
      countryStats={countryStats}
      deviceStats={deviceStats}
      browserStats={browserStats}
      dailyData={dailyData}
      totalClicks={link.clicks.length}
    />
  )
}
