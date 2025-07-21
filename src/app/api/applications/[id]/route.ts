import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/utils/auth';
import prisma from '@/lib/db';

export async function POST(req: NextRequest, context : { params: { id: string } }) {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const {id} = context.params;
    const projectId = parseInt(id, 10);
    console.log(projectId)
    const body = await req.json();
    const { projectRequiredRoleId } = body;

    // Check required data
    if (!projectId || !projectRequiredRoleId) {
      return NextResponse.json({ error: 'Missing project or role' }, { status: 400 });
    }

    // Check if user has already applied
    const existing = await prisma.application.findFirst({
      where: {
        userId: user.id,
        projectRequiredRoleId,
      },
    });
    console.log(existing);
    if (existing) {
      return NextResponse.json({ error: 'You have already applied for this role.' }, { status: 409 });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        projectRequiredRoleId,
        status: 'Applied',
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to apply.' }, { status: 500 });
  }
}

