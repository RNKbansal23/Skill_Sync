import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export function getUserIdFromRequest(req: NextApiRequest): number | null {
  const token = req.cookies['token'];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}
