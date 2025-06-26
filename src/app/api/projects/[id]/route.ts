import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const project = await prisma.project.findUnique({
    where: { id: Number(params.id) },
    include: { owner: true, partnerships: { include: { user: true } } }
  })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  return NextResponse.json(project)
}