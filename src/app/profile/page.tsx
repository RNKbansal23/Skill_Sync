// pages/profile/[id]/page.tsx or app/profile/page.tsx (Server Component)
import ProfileShell from '@/components/ProfileShell'
import { getUserFromSession } from '@/utils/auth';
import prisma from '@/lib/db';

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

  return (
    <ProfileShell user={userProfile} isOwner={true} />
  )
}
