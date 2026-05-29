'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (res?.error) {
        setError('Неверный email или пароль')
      } else {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-ink flex flex-col">
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="font-black text-xl tracking-tighter text-paper">
            SN<span className="text-accent">IP</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-black tracking-tighter mb-1">Добро пожаловать</h1>
          <p className="text-muted text-sm mb-8">Войдите в свой аккаунт</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-widest mb-2">
                Пароль
              </label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm font-mono text-red-400">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full justify-center flex" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Войти'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-accent hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
