import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const hackathons = await prisma.hackathon.findMany()
  return NextResponse.json(hackathons)
}
