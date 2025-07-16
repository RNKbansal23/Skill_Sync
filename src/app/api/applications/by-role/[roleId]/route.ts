import { getUserFromSession } from '@/utils/auth';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roleId = parseInt(params.roleId);

    const role = await prisma.projectRequiredRole.findUnique({
      where: { id: roleId },
      include: { project: true },
    });

    if (!role || role.project.ownerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const applications = await prisma.application.findMany({
      where: { projectRequiredRoleId: roleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                profilePicUrl: true,
                bio: true,
                linkedin: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (err) {
    console.error('Error fetching applications:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
