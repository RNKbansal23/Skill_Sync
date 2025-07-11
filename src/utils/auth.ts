import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import {cookies} from 'next/headers';

export async function getUserIdFromRequest(req: NextRequest): number | null {
  const cookieStore = await cookies();
  const token = await cookieStore.get('token')?.value;

  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    console.log('decoded: ', decoded);
    return decoded.userId;
  } catch {
    return null;
  }
}
