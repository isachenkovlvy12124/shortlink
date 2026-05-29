'use client'

import { useState } from 'react'
import { ArrowRight, Copy, Check, Loader2 } from 'lucide-react'

export function HeroForm() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<{ shortUrl: string; slug: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      setResult({ shortUrl: `${appUrl}/${data.slug}`, slug: data.slug })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          className="input-field flex-1 text-base"
          placeholder="https://example.com/very-long-url..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Сократить
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-sm font-mono text-red-400">{error}</p>
      )}

      {result && (
        <div className="flex items-center gap-3 bg-surface border border-accent/30 rounded-sm px-4 py-3 animate-fade-up">
          <span className="font-mono text-accent flex-1 text-sm truncate">{result.shortUrl}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-paper transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Копировать
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
