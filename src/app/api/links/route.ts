import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, isValidUrl } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { clicks: true } } },
  })

  return NextResponse.json(links)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session ? (session.user as any).id : null

    const { originalUrl, slug: customSlug, title, expiresAt } = await req.json()

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json({ error: 'Некорректный URL' }, { status: 400 })
    }

    let slug = customSlug?.trim()
    if (slug) {
      if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
        return NextResponse.json(
          { error: 'Алиас может содержать только буквы, цифры, - и _' },
          { status: 400 }
        )
      }
      const existing = await prisma.link.findUnique({ where: { slug } })
      if (existing) {
        return NextResponse.json({ error: 'Этот алиас уже занят' }, { status: 409 })
      }
    } else {
      // Generate unique slug
      let attempts = 0
      do {
        slug = generateSlug()
        const existing = await prisma.link.findUnique({ where: { slug } })
        if (!existing) break
        attempts++
      } while (attempts < 10)
    }

    const link = await prisma.link.create({
      data: {
        slug,
        originalUrl,
        title: title || null,
        userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
