import {NextResponse} from 'next/server'
import prisma from '@/lib/db'
import { trackFallbackParamAccessed } from 'next/dist/server/app-render/dynamic-rendering'

export async function GET(
    request: Request, 
    {params}: {params: {id: string}}
){
    const user = await prisma.user.findUnique({
        where: {id: Number(params.id)},
        include: {profile: true, skills: {include: {skill: true}}}
    })
    if(!user) return NextResponse.json({error: 'User not found'}, {status: 404})
    return NextResponse.json(user)
}