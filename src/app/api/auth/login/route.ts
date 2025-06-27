import {NextResponse} from 'next/server'
import prisma from "@/lib/db"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(request: Request){
    try{
        const {email, password} = await request.json()
        const user = await prisma.user.findUnique({where: {email}});
        if(!user) {
            return NextResponse.json({error: 'Invalid Credentials'}, {status: 401})
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid){
            return NextResponse.json({error: 'Invalid Credentials'}, {status: 401})
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        )
        const response = NextResponse.json({
            message: "Login successful",
            user: { id: user.id, email: user.email },
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60,
        });

        return response;
    } catch (error){
        return NextResponse.json({error: 'Login failed'}, {status: 500})
    }
}