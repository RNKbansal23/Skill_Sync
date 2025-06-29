import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/db'

export async function GET() {
  const token = (await cookies()).get('token')?.value
  const JWT_SECRET = process.env.JWT_SECRET

  if (!token || !JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number }
    const userId = payload.userId

    // Fetch projects owned by the user
    const ownedProjects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: { owner: true }
    })

    return NextResponse.json({ projects: ownedProjects })
  } catch (err) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
