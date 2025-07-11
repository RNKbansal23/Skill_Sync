import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/db'
import Dashboard from '@/components/Dashboard'

export default async function DashboardPage() {
  const token = (await cookies()).get('token')?.value
  let userId: number | null = null
  const JWT_SECRET = process.env.JWT_SECRET
  if (token && JWT_SECRET) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number }
      userId = payload.userId
    } catch {
      userId = null
    }
  }

  if (!userId) {
    return <div className="flex items-center justify-center min-h-screen">Please log in.</div>
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      ownedProjects: true, 
      partnerships: {
        include: {
          project: true,
        }
      }
    }
  })

  if (!user) {
  return <div className="flex items-center justify-center min-h-screen">User not found.</div>
  }

  const profileFields = [
    user?.profile?.bio,
    user?.profile?.linkedin,
    user?.profile?.leetcode,
    user?.profile?.resumeUrl,
    user?.name,
    user?.email,
  ]
  const filled = profileFields.filter(Boolean).length
  const profileCompletion = Math.round((filled / profileFields.length) * 100)

  const ownedProjects = user?.ownedProjects || [] 
  const memberProjects = user?.partnerships.map(p => p.project) || []
  // Remove duplicates if any
  const allProjects = [
    ...ownedProjects,
    ...memberProjects.filter(
      mp => !ownedProjects.some(op => op.id === mp.id)
    ),
  ]

  // 5. Prepare user object for the dashboard
  const dashboardUser = {
    name: user?.name || '',
    profilePic: user?.profile?.profilePic || '/default-profile.jpg',
    profileCompletion,
    projects: allProjects,
    recommendations: [], // Fill as needed
    events: [], // Fill as needed
    activity: [], // Fill as needed
  }

  return <Dashboard user={dashboardUser} />
}
