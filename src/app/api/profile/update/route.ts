/*
// TODO: UNCOMMENT THIS FILE WHEN THE BACKEND IS READY

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  // 1. Authenticate user
  const token = cookies().get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let userId: number;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    userId = payload.userId;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
*/