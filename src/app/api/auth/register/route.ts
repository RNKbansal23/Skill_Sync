import {NextResponse} from 'next/server'
import prisma from "@/lib/db"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        )

        return NextResponse.json({ 
        message: 'User registered', 
        user: { id: user.id, email: user.email },
        token 
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }
}