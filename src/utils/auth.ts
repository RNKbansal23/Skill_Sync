// import jwt from 'jsonwebtoken';
// import { NextRequest } from 'next/server';
// import {cookies} from 'next/headers';

// export async function getUserIdFromRequest(req: NextRequest): number | null {
//   const cookieStore = await cookies();
//   const token = await cookieStore.get('token')?.value;

//   if (!token) return null;
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
//     console.log('decoded: ', decoded);
//     return decoded.userId;
//   } catch {
//     return null;
//   }
// }

// src/lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true }, // select only safe fields
    });

    return user;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
