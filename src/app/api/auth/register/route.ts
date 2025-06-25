import {NextResponse} from 'next/server'
import prisma from "@/lib/db"
import bcrypt from 'bcrypt'

export async function POST(request: Request){
    try{
        const {name, email, password} = await request.json()
        const existingUser = await prisma.user.findUnique({where: {email}})

        if(existingUser){
            return NextResponse.json({error: 'User already exists'}, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return NextResponse.json({message: 'User registered', user: {id: user.id, email: user.email}}, {status: 500});
    } catch (error){
        return NextResponse.json({error: "Registration failed"}, {status: 500})
    }
}