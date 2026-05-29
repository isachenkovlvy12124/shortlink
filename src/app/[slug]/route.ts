import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UAParser } from 'ua-parser-js'

interface Params {
  params: { slug: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = params

  const link = await prisma.link.findUnique({ where: { slug } })

  if (!link) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Check expiry
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json(
      { error: 'Link expired' },
      { status: 410 }
    )
  }

  // Track click asynchronously
  try {
    const ua = req.headers.get('user-agent') || ''
    const parser = new UAParser(ua)
    const result = parser.getResult()

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      null

    const referer = req.headers.get('referer') || null

    // Geo lookup (basic - uses Cloudflare headers if available)
    const country =
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-vercel-ip-country') ||
      null

    await prisma.click.create({
      data: {
        linkId: link.id,
        country,
        device: result.device.type || 'desktop',
        browser: result.browser.name || null,
        os: result.os.name || null,
        referer,
        ip,
      },
    })
  } catch (err) {
    // Don't block redirect on analytics error
    console.error('Click tracking error:', err)
  }

  return NextResponse.redirect(link.originalUrl, { status: 302 })
}
