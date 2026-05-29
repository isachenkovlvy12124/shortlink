'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2 } from 'lucide-react'

export function CreateLinkModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    originalUrl: '',
    slug: '',
    title: '',
    expiresAt: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body: any = { originalUrl: form.originalUrl }
      if (form.slug) body.slug = form.slug
      if (form.title) body.title = form.title
      if (form.expiresAt) body.expiresAt = new Date(form.expiresAt).toISOString()

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')

      setOpen(false)
      setForm({ originalUrl: '', slug: '', title: '', expiresAt: '' })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Новая ссылка
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-surface border border-border rounded-sm w-full max-w-md p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black tracking-tight text-lg">Новая ссылка</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-muted hover:text-paper transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/..."
                  value={form.originalUrl}
                  onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                  Кастомный алиас
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-muted text-sm font-mono">snip.io/</span>
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="my-link"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: e.target.value.replace(/[^a-zA-Z0-9-_]/g, '') })
                    }
                    pattern="[a-zA-Z0-9\-_]+"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                  Название
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Моя ссылка"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                  Срок действия
                </label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>

              {error && <p className="text-sm font-mono text-red-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-ghost flex-1"
                >
                  Отмена
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center flex" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
