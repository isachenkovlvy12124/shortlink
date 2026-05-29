import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const link = await prisma.link.findFirst({
    where: { id: params.id, userId },
    include: { _count: { select: { clicks: true } } },
  })

  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(link)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const link = await prisma.link.findFirst({ where: { id: params.id, userId } })
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.link.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
