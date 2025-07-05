import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'
import { getUserIdFromRequest } from '@/utils/auth'

export async function GET(request: Request) {
  try {
    // Get user ID from JWT cookie
    const cookieStore = cookies()
    const userId = getUserIdFromRequest({ cookies: cookieStore })

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch user and profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prepare the response structure to match your client expectation
    const profile = user.profile || {}

    return NextResponse.json({
      user: {
        name: user.name || '',
        bio: profile.bio || '',
        linkedin: profile.linkedin || '',
        leetcode: profile.leetcode || '',
        profilePic: profile.profilePicUrl || null,  // Use profilePicUrl as profilePic
        resumeUrl: profile.resumeUrl || null,
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
