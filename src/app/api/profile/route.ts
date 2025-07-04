import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getUserIdFromRequest } from '@/utils/auth'

export async function GET(req: NextRequest) {
  // Get the user ID from the JWT in cookies
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch user and profile from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Optionally, filter out sensitive fields
  const { password, ...safeUser } = user

  return NextResponse.json(safeUser, { status: 200 })
}
