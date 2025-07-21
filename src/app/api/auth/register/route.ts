import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from "@/lib/db"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
    try {
        const cookieStore = cookies()
        const { name, email, password } = await request.json()
        const existingUser = await prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        // Create the profile, putting the name into the Profile table too
        await prisma.profile.create({
            data: {
                userId: user.id,
                name: name,     // <--- Here!
            }
        })
        // Or if you ever want more profile fields: ... bio, etc.

        // JWT and cookie logic as before
        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        )
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60, // 1 hour
        })

        return NextResponse.json({
            message: 'User registered',
            user: { id: user.id, email: user.email },
            token
        }, { status: 201 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }
}
