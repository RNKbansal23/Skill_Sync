// app/api/me/projects/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  let userId = null;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (token && JWT_SECRET) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = payload.userId;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const projects = await prisma.project.findMany({
    where: { users: { some: { id: userId } } }, // Adjust to your schema
  });
  return NextResponse.json({ projects });
}
