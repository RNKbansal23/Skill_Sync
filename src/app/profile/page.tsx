import ProfileForm from '@/components/ProfileForm'
import ProfilePageLayout from '@/components/ProfilePageLayout'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProfilePage({ params }) {
  // Getting cookies for authentication
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  // Fetch logged-in user info
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/profile/me`, {
    headers: { cookie: `token=${token}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    if (res.status === 401) redirect('/login')
    return (
      <ProfilePageLayout>
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Could not load profile</h1>
        </main>
      </ProfilePageLayout>
    )
  }

  const data = await res.json()
  const { user } = data

  // If you support viewing other users' profiles, compare user.id and loggedInUserId
  // For now, assume user.id is the logged-in user

  return (
    <ProfilePageLayout>
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep your personal and professional details up-to-date.
          </p>
        </div>
        <ProfileForm user={user} isOwner={true} />
      </main>
    </ProfilePageLayout>
  )
}
