import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { getUserIdFromRequest } from '@/utils/auth';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = await getUserIdFromRequest({cookies: cookieStore})

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // 2. Parse request body
  const { name, bio, linkedin, leetcode } = await request.json();

  try {
    // 3. Update data in the database
    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name },
      }),
      prisma.profile.upsert({
        where: { userId },
        update: { bio, linkedin, leetcode },
        create: { userId, bio, linkedin, leetcode },
      }),
    ]);

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
