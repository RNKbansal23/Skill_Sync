// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Create response
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
  
  // Clear token cookie using same parameters as login
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Expire immediately
  });

  return response;
}
