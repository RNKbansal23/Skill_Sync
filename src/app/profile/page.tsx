import ProfileForm from '@/components/ProfileForm'
import { User, Profile } from '@prisma/client'
import ProfilePageLayout from '@/components/ProfilePageLayout'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'
import { getUserIdFromRequest } from '@/utils/auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  // 1. Get cookies and user ID
  const cookieStore = cookies()
  const userId = getUserIdFromRequest({ cookies: cookieStore })

  // 2. If not logged in, redirect to login
  if (!userId) {
    redirect('/login')
  }

  // 3. Fetch user and profile from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  })

  // 4. Handle user not found
  if (!user) {
    return (
      <ProfilePageLayout>
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">User Not Found</h1>
        </main>
      </ProfilePageLayout>
    )
  }

  // 5. Render the profile page with real data
  return (
    <ProfilePageLayout>
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep your personal and professional details up-to-date.
          </p>
        </div>
        <ProfileForm user={user} />
      </main>
    </ProfilePageLayout>
  )
}
