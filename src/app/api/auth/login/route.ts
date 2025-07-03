import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';

// Disable default body parsing for file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse multipart form data
function parseForm(req: Request): Promise<{ files: formidable.Files }> {
  // @ts-ignore
  return new Promise((resolve, reject) => {
    const form = formidable();
    // @ts-ignore
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ files });
    });
  });
}

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
  // 1. Get userId from JWT in cookies
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse the uploaded file
  // Next.js App Router does NOT support formidable directly; workaround:
  // We need to use the Node.js request object. NextRequest does not expose it directly,
  // so for file uploads in App Router, use a pages/api route or use edge functions with a 3rd party lib.
  // For now, let's use a workaround for demonstration:

  const formData = await request.formData();
  const file = formData.get('resume') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Read file as buffer (App Router: file is a Blob)
  // @ts-ignore
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Store in DB
  try {
    await prisma.profile.update({
      where: { userId },
      data: { resumeFile: buffer },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }
}
