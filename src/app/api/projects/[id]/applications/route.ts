// app/api/projects/[projectId]/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }) {
  const projectId = Number(params.projectId);
  if (!projectId) return NextResponse.json({ error: "No projectId" }, { status: 400 });

  // Get all requiredRoles for this project
  const requiredRoles = await prisma.projectRequiredRole.findMany({
    where: { projectId },
    include: {
      applications: { 
        include: { user: true } // include applicant info
      }
    }
  });

  // Flatten all applications for all roles
  const applications = requiredRoles.flatMap(role =>
    role.applications.map(app => ({
      id: app.id,
      status: app.status,
      appliedAt: app.appliedAt,
      user: app.user,
      role: {
        id: role.id,
        role: role.role,
        expertiseLevel: role.expertiseLevel,
      }
    }))
  );

  return NextResponse.json({ applications });
}
