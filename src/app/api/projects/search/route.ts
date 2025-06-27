// app/api/projects/search/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    let projects

    if (!query.trim()) {
        projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                owner: {
                    select: { name: true } // Only fetch the owner's name
                }
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
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                owner: {
                    select: { name: true }
                }
            }
        })
    }
    return NextResponse.json(projects)
}
