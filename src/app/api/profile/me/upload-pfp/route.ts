import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

export async function POST(request: Request): Promise<NextResponse> {
  // 1. Authenticate user
  const token = cookies().get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!token || !JWT_SECRET) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  let userId: number;
  try {
    userId = (jwt.verify(token, JWT_SECRET) as { userId: number }).userId;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // 2. Get file from request
  const file = request.body || '';
  const filename = request.headers.get('x-vercel-filename') || 'profile-picture.png';
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }
  
  // 3. Upload to Vercel Blob
  try {
    const uniquePath = `profile-pictures/${userId}-${filename}`;
    const blob = await put(uniquePath, file, { 
      access: 'public',
      contentType: request.headers.get('content-type') || 'image/png',
     });
    
    // 4. Update database
    await prisma.profile.upsert({
        where: { userId: userId },
        update: { profilePic: blob.url },
        create: { userId: userId, profilePic: blob.url },
    });

    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}