'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Link2, LogOut } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  user?: { name?: string | null; email?: string | null }
}

export function DashboardNav({ user }: Props) {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-ink/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-black text-xl tracking-tighter text-paper">
            SN<span className="text-accent">IP</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm transition-colors',
                pathname === '/dashboard'
                  ? 'bg-surface text-paper'
                  : 'text-muted hover:text-paper'
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Обзор
            </Link>
            <Link
              href="/dashboard/links"
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm transition-colors',
                pathname.startsWith('/dashboard/links')
                  ? 'bg-surface text-paper'
                  : 'text-muted hover:text-paper'
              )}
            >
              <Link2 className="w-4 h-4" />
              Ссылки
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted font-mono hidden sm:block truncate max-w-32">
            {user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  )
}
