import {NextResponse} from 'next/server'
import prisma from '@/lib/db'
import {getUserIdFromRequest} from '@/lib/auth'

export async function GET(request: Request){
    const userId = await getUserIdFromRequest(request)
    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    const projects = await prisma.project.findMany({
        where: {
            OR: [
                {ownerId: userId},
                {member: {some:{id: userId}}}
            ]
        },
        orderBy:{createdAt: 'desc'}
    })

    return NextResponse.json(projects)
}