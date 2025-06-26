import {NextResponse} from 'next/server'
import prisma from "@/lib/db"

export async function GET(){
    const projects = await prisma.project.findMany({include: {owner: true, partnerships: true}})
    return NextResponse.json({message: projects})
}
