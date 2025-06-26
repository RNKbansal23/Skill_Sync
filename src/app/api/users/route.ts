import {NextResponse} from 'next/server'
import prisma from "@/lib/db"

export async function GET(){
    const users = await prisma.user.findMany({
        select: {id: true, name: true, email: true, createdAt: true}
    })
    return NextResponse.json(users);
}