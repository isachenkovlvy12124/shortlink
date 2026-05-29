import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'SNIP — Short links, big impact',
  description: 'Create short links with analytics, QR codes, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="noise">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
