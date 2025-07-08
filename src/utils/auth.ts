import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import {cookies} from 'next/headers';

export async function getUserIdFromRequest(req: NextRequest): number | null {
  const token = req.cookies.get('token')?.value;
  console.log(token)
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}
