import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

function getCookie(name: string): string | null {
  const value = document.cookie;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const lastPart = parts.pop();
    return lastPart ? lastPart.split(';').shift() ?? null : null;
  }
  return null;
}

export function getUserFromToken(): { userId: number; username?: string } | null {
  if (!JWT_SECRET) {
    console.warn('JWT_SECRET is not set');
    return null;
  }
  try {
    const token = getCookie('token');
    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; username?: string };

    return {
      userId: payload.userId,
      username: payload.username,
    };
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return null;
  }
}
