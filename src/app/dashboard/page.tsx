import prisma from '@/lib/db'
import Dashboard from '@/components/Dashboard'
import { getUserFromSession } from '@/utils/auth' // Your own logic

export default async function DashboardPage() {
  const user = await getUserFromSession();
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Please log in.</div>
  }

  const userInfo = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      ownedProjects: true, 
      partnerships: {
        include: {
          project: true,
        }
      }
    }
  });

  if (!userInfo) {
    return <div className="flex items-center justify-center min-h-screen">User not found.</div>
  }

  const profileFields = [
    userInfo?.profile?.bio,
    userInfo?.profile?.linkedin,
    userInfo?.profile?.leetcode,
    userInfo?.profile?.resumeUrl,
    userInfo?.name,
    userInfo?.email,
  ]
  const filled = profileFields.filter(Boolean).length
  const profileCompletion = Math.round((filled / profileFields.length) * 100)

  const ownedProjects = userInfo?.ownedProjects || [] 
  const memberProjects = userInfo?.partnerships.map(p => p.project) || []
  // Remove duplicates if any
  const allProjects = [
    ...ownedProjects,
    ...memberProjects.filter(
      mp => !ownedProjects.some(op => op.id === mp.id)
    ),
  ]

  // Prepare user object for the dashboard
  const dashboardUser = {
    id: userInfo.id,
    name: userInfo?.name || '',
    profilePic: userInfo?.profile?.profilePic || '/default-profile.jpg',
    profileCompletion,
    projects: allProjects,
    recommendations: [], // Fill as needed
    events: [], // Fill as needed
    activity: [], // Fill as needed
  }

  return <Dashboard user={dashboardUser} />
}
