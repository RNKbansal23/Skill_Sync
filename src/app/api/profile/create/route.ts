import { getUserFromSession } from '@/utils/auth' // implement this for your auth system
import prisma from '@/lib/db'
import { NextResponse, NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
  console.log('rev')
  const body = await req.json()
  const userId = await getUserFromSession(req)
  console.log(userId);
  if (!userId){
    return NextResponse.json({ error: 'Unauthorized' }, {status: 401})
  } 
  const { bio, linkedin, leetcode } = body
  try {
    const profile = await prisma.profile.upsert({
      where: { userId: userId.id },
      update: { bio, linkedin, leetcode },
      create: { userId: userId.id, bio, linkedin, leetcode },
    })

    return NextResponse.json({
      success: true,
      profile: {
        bio: profile.bio || '',
        linkedin: profile.linkedin || '',
        leetcode: profile.leetcode || '',
      }
    }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create profile' }, {status: 500})
  }
}
