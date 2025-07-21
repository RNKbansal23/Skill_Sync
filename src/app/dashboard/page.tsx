// app/dashboard/page.tsx

import prisma from '@/lib/db'
import Dashboard from '@/components/Dashboard'
import { getUserFromSession } from '@/utils/auth'

export default async function DashboardPage() {
  const user = await getUserFromSession()
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Please log in.
      </div>
    )
  }

  const userInfo = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      partnerships: {
        include: {
          project: true, // Includes project metadata
        },
      },
    },
  })

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        User not found.
      </div>
    )
  }

  const ownedProjectIds = (
    await prisma.project.findMany({
      where: {
        ownerId: user.id,
      },
      select: {
        id: true,
      },
    })
  ).map((p) => p.id)

  const memberProjectIds = userInfo.partnerships.map(
    (p) => p.project?.id
  ) as number[]

  const allProjectIds = Array.from(new Set([...ownedProjectIds, ...memberProjectIds]))

  const allProjects = await prisma.project.findMany({
    where: {
      id: {
        in: allProjectIds,
      },
    },
    include: {
      requiredRoles: true,
    },
  })

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

  const dashboardUser = {
    id: userInfo.id,
    name: userInfo?.name || '',
    profilePic: userInfo?.profile?.profilePic || '/default-profile.jpg',
    profileCompletion,
    projects: allProjects, // includes requiredRoles
    recommendations: [], // TODO
    events: [], // TODO
  }

  return <Dashboard user={dashboardUser} />
}
