import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

interface Params {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const link = await prisma.link.findFirst({ where: { id: params.id, userId } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const shortUrl = `${appUrl}/${link.slug}`

  const qr = await QRCode.toDataURL(shortUrl, {
    width: 400,
    margin: 2,
    color: {
      dark: '#f5f3ef',
      light: '#1a1a22',
    },
  })

  return NextResponse.json({ qr })
}
