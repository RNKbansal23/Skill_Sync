    import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import jwt from 'jsonwebtoken';

// Helper to extract userId from JWT in cookies
function getUserIdFromRequest(request: NextRequest): number | null {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  // 1. Extract userId from JWT in cookies
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: No valid token' }, { status: 401 });
  }

  // 2. Parse the uploaded file from formData
  const formData = await request.formData();
  const file = formData.get('resume') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // 3. Validate file type (PDF)
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Invalid file type. Only PDF allowed.' }, { status: 400 });
  }

  // 4. Read file as buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 5. Update the profile with the resume file
  try {
    await prisma.profile.update({
      where: { userId },
      data: { resumeFile: buffer },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// 
// kesrjglrjlesrjglsejglerglsjregkl
// 
