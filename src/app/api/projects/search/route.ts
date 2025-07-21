// app/api/projects/search/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    let projects

    if (!query.trim()) {
        projects = await prisma.project.findMany({
            include: {
                owner: true,
                requiredRoles: true,
            }
        })
    } else {
        projects = await prisma.project.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } }
                ]
            },
            include: {
                owner: true,
                requiredRoles: true,
            }
        })
    }
    console.log(projects)
    return NextResponse.json({projects: projects})
}
