import { getUserFromSession } from '@/utils/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import ProfileShell from '@/components/ProfileShell'; // new component

export default async function ProfilePage({params}) {
    const user = await getUserFromSession();
    const profileId = parseInt(params.profileId, 10);
  
    if (!user) redirect('/login');

  const profile = await prisma.profile.findUnique({
    where: { userId: profileId },
    select: {
      name: true,
      bio: true,
      linkedin: true,
      leetcode: true,
      profilePic: true,
      resumeUrl: true,
    },
  });

  console.log(profile)

  if (!profile) {
    return <div className="p-8 text-center text-gray-500">Profile not found</div>;
  }

  const userProfile = {
    id: profileId,
    name: profile.name,
    ...profile,
  };

  return <ProfileShell user={userProfile} isOwner = {user.id == profileId} />;
}