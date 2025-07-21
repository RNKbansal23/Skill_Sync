import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getUserFromSession } from '@/utils/auth';

// GET: List all projects
export async function GET() {
  const projects = await prisma.project.findMany({
    include: { 
      owner: true,
      requiredRoles: true,
    }
  })
return NextResponse.json({ projects })
}

// POST: Create a new project with required roles
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const session = await getUserFromSession(request);
    console.log('print: ', session);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user token found.' },
        { status: 401 }
      );
    }

    // 1. Verify owner exists
    const owner = await prisma.user.findUnique({
      where: { id: session.id }
    });
    if (!owner) {
      return NextResponse.json(
        { error: `User with ID ${session.id} not found` },
        { status: 404 }
      );
    }

    // 2. Validate required roles
    if (!data.requiredRoles || !Array.isArray(data.requiredRoles)) {
      return NextResponse.json(
        { error: 'requiredRoles must be an array' },
        { status: 400 }
      );
    }

    // 3. Create project with roles
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId: session.id,
        requiredRoles: {
          create: data.requiredRoles.map((role: any) => ({
            role: role.role,
            expertiseLevel: role.expertiseLevel,
            peopleRequired: role.peopleRequired,
            isLive: true
          }))
        }
      },
      include: { requiredRoles: true }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
