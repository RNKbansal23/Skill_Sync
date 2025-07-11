// src/app/api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserIdFromRequest } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { projectId, projectRequiredRoleId } = await request.json();
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: {
        userId,
        projectRequiredRoleId: projectRequiredRoleId || undefined,
      },
    });
    if (existing) {
      return NextResponse.json({ error: 'Already applied' }, { status: 409 });
    }

    // Create application
    const app = await prisma.application.create({
      data: {
        userId,
        projectRequiredRoleId,
        status: 'Applied',
      },
    });

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
