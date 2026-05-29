'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, Trash2, ExternalLink, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/lib/utils'

interface LinkItem {
  id: string
  slug: string
  originalUrl: string
  title: string | null
  createdAt: Date
  expiresAt: Date | null
  _count: { clicks: number }
}

interface Props {
  links: LinkItem[]
  appUrl: string
}

export function LinksTable({ links, appUrl }: Props) {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleCopy(slug: string, id: string) {
    await navigator.clipboard.writeText(`${appUrl}/${slug}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить эту ссылку?')) return
    await fetch(`/api/links/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (links.length === 0) {
    return (
      <div className="card text-center py-16">
        <p className="text-muted">Ссылок нет. Создайте первую!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date()
        return (
          <div
            key={link.id}
            className="card flex items-center gap-4 hover:border-border/80 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-accent text-sm">
                  {appUrl}/{link.slug}
                </span>
                {link.title && (
                  <span className="tag border-border/50 text-muted">
                    {link.title}
                  </span>
                )}
                {isExpired && (
                  <span className="tag border-red-500/30 text-red-400">
                    истекла
                  </span>
                )}
              </div>
              <div className="text-xs text-muted truncate">{link.originalUrl}</div>
              <div className="text-xs text-muted/60 mt-1 font-mono">
                {timeAgo(link.createdAt)}
                {link.expiresAt && !isExpired && (
                  <span className="ml-3 text-accent/60">
                    до {new Date(link.expiresAt).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-center shrink-0 hidden sm:block">
              <div className="text-xl font-black">{link._count.clicks}</div>
              <div className="text-xs text-muted">кликов</div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleCopy(link.slug, link.id)}
                className="p-2 text-muted hover:text-paper transition-colors"
                title="Копировать"
              >
                {copiedId === link.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href={`${appUrl}/${link.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted hover:text-paper transition-colors"
                title="Открыть"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href={`/dashboard/links/${link.id}`}
                className="p-2 text-muted hover:text-accent transition-colors"
                title="Аналитика"
              >
                <BarChart3 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDelete(link.id)}
                className="p-2 text-muted hover:text-red-400 transition-colors"
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
