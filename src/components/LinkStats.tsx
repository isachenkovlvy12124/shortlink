'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ArrowLeft, Copy, Check, QrCode, MousePointerClick, Globe, Monitor } from 'lucide-react'
import { formatNumber, timeAgo } from '@/lib/utils'

interface Props {
  link: {
    id: string
    slug: string
    originalUrl: string
    title: string | null
    createdAt: string
    expiresAt: string | null
  }
  appUrl: string
  countryStats: Record<string, number>
  deviceStats: Record<string, number>
  browserStats: Record<string, number>
  dailyData: { date: string; count: number }[]
  totalClicks: number
}

function StatList({ data, max }: { data: Record<string, number>; max: number }) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8)
  return (
    <div className="space-y-2">
      {sorted.map(([key, count]) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted w-24 truncate">{key}</span>
          <div className="flex-1 bg-border rounded-full h-1.5">
            <div
              className="bg-accent h-1.5 rounded-full transition-all"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-paper w-8 text-right">{count}</span>
        </div>
      ))}
    </div>
  )
}

export function LinkStats({
  link,
  appUrl,
  countryStats,
  deviceStats,
  browserStats,
  dailyData,
  totalClicks,
}: Props) {
  const [copied, setCopied] = useState(false)
  const [qrSrc, setQrSrc] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)

  const shortUrl = `${appUrl}/${link.slug}`
  const maxCountry = Math.max(...Object.values(countryStats), 1)
  const maxDevice = Math.max(...Object.values(deviceStats), 1)
  const maxBrowser = Math.max(...Object.values(browserStats), 1)

  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleQr() {
    if (!showQr) {
      const res = await fetch(`/api/links/${link.id}/qr`)
      const data = await res.json()
      setQrSrc(data.qr)
    }
    setShowQr(!showQr)
  }

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date()

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/dashboard/links"
          className="text-muted hover:text-paper transition-colors mt-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-black text-2xl tracking-tight font-mono text-accent">
              {appUrl}/{link.slug}
            </h1>
            {link.title && (
              <span className="tag border-border text-muted">{link.title}</span>
            )}
            {isExpired && (
              <span className="tag border-red-500/30 text-red-400">истекла</span>
            )}
          </div>
          <p className="text-muted text-sm mt-1 truncate">{link.originalUrl}</p>
          <p className="text-xs text-muted/60 font-mono mt-1">
            Создана {timeAgo(new Date(link.createdAt))}
            {link.expiresAt && (
              <span className="ml-3">
                · до {new Date(link.expiresAt).toLocaleDateString('ru-RU')}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="btn-ghost flex items-center gap-2 text-sm py-2"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
          <button
            onClick={handleQr}
            className="btn-ghost flex items-center gap-2 text-sm py-2"
          >
            <QrCode className="w-4 h-4" />
            QR
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {showQr && qrSrc && (
        <div className="card flex flex-col items-center gap-4 py-8 animate-fade-up">
          <img src={qrSrc} alt="QR Code" className="w-48 h-48" />
          <p className="text-xs font-mono text-muted">{shortUrl}</p>
          <a
            href={qrSrc}
            download={`qr-${link.slug}.png`}
            className="btn-ghost text-sm py-2"
          >
            Скачать
          </a>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <MousePointerClick className="w-4 h-4 text-accent mx-auto mb-2" />
          <div className="text-3xl font-black">{formatNumber(totalClicks)}</div>
          <div className="text-xs text-muted mt-1">Всего кликов</div>
        </div>
        <div className="card text-center">
          <Globe className="w-4 h-4 text-accent mx-auto mb-2" />
          <div className="text-3xl font-black">{Object.keys(countryStats).length}</div>
          <div className="text-xs text-muted mt-1">Стран</div>
        </div>
        <div className="card text-center">
          <Monitor className="w-4 h-4 text-accent mx-auto mb-2" />
          <div className="text-3xl font-black">{Object.keys(deviceStats).length}</div>
          <div className="text-xs text-muted mt-1">Устройств</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h2 className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
          Клики за 14 дней
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff4d00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: '#8a8680', fontSize: 10, fontFamily: 'DM Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis
              tick={{ fill: '#8a8680', fontSize: 10, fontFamily: 'DM Mono' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#1a1a22',
                border: '1px solid #2a2a35',
                borderRadius: 0,
                fontFamily: 'DM Mono',
                fontSize: 12,
              }}
              labelStyle={{ color: '#8a8680' }}
              itemStyle={{ color: '#ff4d00' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#ff4d00"
              strokeWidth={2}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Страны', data: countryStats, max: maxCountry },
          { title: 'Устройства', data: deviceStats, max: maxDevice },
          { title: 'Браузеры', data: browserStats, max: maxBrowser },
        ].map(({ title, data, max }) => (
          <div key={title} className="card">
            <h3 className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
              {title}
            </h3>
            {Object.keys(data).length === 0 ? (
              <p className="text-muted text-sm">Нет данных</p>
            ) : (
              <StatList data={data} max={max} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
