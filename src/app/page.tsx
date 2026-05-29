import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { HeroForm } from '@/components/HeroForm'
import { ArrowRight, Zap, BarChart3, QrCode, Clock } from 'lucide-react'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-ink">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-black text-xl tracking-tighter text-paper">
            SN<span className="text-accent">IP</span>
          </span>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="btn-primary text-sm py-2">
                Кабинет →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-muted hover:text-paper transition-colors">
                  Войти
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="text-xs font-mono text-muted uppercase tracking-widest">Сервис коротких ссылок</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            Короткие<br />
            ссылки.<br />
            <span className="text-accent">Большие</span><br />
            данные.
          </h1>

          <p className="text-muted text-lg mb-12 max-w-md leading-relaxed">
            Сокращайте URL, отслеживайте переходы, генерируйте QR-коды. 
            Всё в одном инструменте.
          </p>

          <HeroForm />
        </div>
      </section>

      {/* Divider */}
      <div className="h-px gradient-line max-w-6xl mx-auto" />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-xs font-mono text-muted uppercase tracking-widest mb-12">
          Возможности
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Zap,
              title: 'Мгновенно',
              desc: 'Ссылка создаётся за секунду. Кастомный алиас или автогенерация.',
            },
            {
              icon: BarChart3,
              title: 'Аналитика',
              desc: 'Клики, страны, устройства, браузеры — всё в реальном времени.',
            },
            {
              icon: QrCode,
              title: 'QR-коды',
              desc: 'Генерируйте QR-код для любой ссылки одним кликом.',
            },
            {
              icon: Clock,
              title: 'Срок действия',
              desc: 'Устанавливайте дату истечения ссылки. Безопасно и удобно.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="card group hover:border-accent/40 transition-colors duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <f.icon className="w-5 h-5 text-accent mb-4" />
              <h3 className="font-bold text-paper mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-black tracking-tighter text-paper/40">
            SN<span className="text-accent/40">IP</span>
          </span>
          <span className="text-xs text-muted font-mono">
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  )
}
