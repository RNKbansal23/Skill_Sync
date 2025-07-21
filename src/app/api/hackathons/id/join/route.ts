import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  // 2. Get hackathon ID from URL
  const hackathonId = parseInt(params.id, 10);
  if (isNaN(hackathonId)) {
    return NextResponse.json({ error: 'Invalid Hackathon ID' }, { status: 400 });
  }

  try {
    // 3. Connect the user to the hackathon's seekingUsers list
    await prisma.hackathon.update({
      where: { id: hackathonId },
      data: {
        seekingUsers: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json({ message: 'Successfully joined the seeking list.' });
  } catch (error) {
    console.error('Error joining hackathon seeking list:', error);
    return NextResponse.json({ error: 'Failed to join seeking list.' }, { status: 500 });
  }
}