import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        )

        // Set cookie
        cookies().set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60, // 1 hour
        })

        return NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email },
            token
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 })
    }
}
