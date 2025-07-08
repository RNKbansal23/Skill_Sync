import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getUserIdFromRequest } from '@/utils/auth';

// GET: List all projects
export async function GET() {
  const projects = await prisma.project.findMany({
    include: { 
      owner: true,
      partnerships: true,
    }
  })
  return NextResponse.json({ message: projects })
}

// POST: Create a new project with required roles
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const ownerId = getUserIdFromRequest(request);

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid user token found.' },
        { status: 401 }
      );
    }

    // 1. Verify owner exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId }
    });
    if (!owner) {
      return NextResponse.json(
        { error: `User with ID ${ownerId} not found` },
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
        ownerId: ownerId,
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
