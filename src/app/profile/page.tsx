import ProfileForm from '@/components/ProfileForm'
import ProfilePageLayout from '@/components/ProfilePageLayout'
import { getUserFromSession } from '@/utils/auth';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProfilePage({ params }) {
  const user = await getUserFromSession();
  if (!user) {
    return <div>Not logged in</div>;
  }

    const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: {
      bio: true,
      linkedin: true,
      leetcode: true,
      profilePic: true,
      resumeUrl: true,
      // ...other fields
    },
  });

    const userProfile = {
    id: user.id,
    name: user.name,
    ...profile,
  };
  // Getting cookies for authentication
  // const cookieStore = await cookies()
  // const token = cookieStore.get('token')?.value

  // if (!token) {
  //   redirect('/login')
  // }

  // Fetch logged-in user info
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  // const res = await fetch(`${baseUrl}/api/profile/me`, {
  //   headers: { cookie: `token=${token}` },
  //   cache: 'no-store',
  // })

  // if (!res.ok) {
  //   if (res.status === 401) redirect('/login')
  //   return (
  //     <ProfilePageLayout>
  //       <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  //         <h1 className="text-3xl font-bold text-gray-900">Could not load profile</h1>
  //       </main>
  //     </ProfilePageLayout>
  //   )
  // }

  // const data = await res.json()
  // const { user } = data

  return (
    <ProfilePageLayout>
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep your personal and professional details up-to-date.
          </p>
        </div>
        <ProfileForm user={userProfile} isOwner={true} />
      </main>
    </ProfilePageLayout>
  )
}
