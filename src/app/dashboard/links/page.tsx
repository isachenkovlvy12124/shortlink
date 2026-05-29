import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateLinkModal } from '@/components/CreateLinkModal'
import { LinksTable } from '@/components/LinksTable'

export default async function LinksPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id

  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { clicks: true } } },
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Ссылки</h1>
          <p className="text-muted text-sm mt-1">{links.length} ссылок</p>
        </div>
        <CreateLinkModal />
      </div>

      <LinksTable links={links} appUrl={appUrl} />
    </div>
  )
}
