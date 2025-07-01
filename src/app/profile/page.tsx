import ProfileForm from '@/components/ProfileForm';
import { User, Profile } from '@prisma/client';

// 1. We import our new Layout component
import ProfilePageLayout from '@/components/ProfilePageLayout'; 

// NOTE: We no longer import Sidebar directly into this file.

// Your mock user data remains the same
const mockUser: User & { profile: Profile | null } = {
  id: 1,
  email: 'rajat.bansal@example.com',
  name: 'Rajat Bansal',
  createdAt: new Date(),
  updatedAt: new Date(),
  profile: {
    id: 1,
    userId: 1,
    bio: 'Full-stack developer passionate about creating innovative web applications and collaborating on exciting projects. Skilled in React, Next.js, and Node.js.',
    linkedin: 'https://www.linkedin.com/in/rajat-bansal-example',
    leetcode: 'https://leetcode.com/rajat-bansal-example',
    profilePic: 'https://i.pravatar.cc/150?u=rajatbansal',
    resumeUrl: null,
  },
};

export default async function ProfilePage() {
  // Your server-side logic stays here

  return (
    // 2. We wrap everything in the ProfilePageLayout
    <ProfilePageLayout>
      {/* The content below is passed as 'children' to the layout */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep your personal and professional details up-to-date.
          </p>
        </div>
        
        <ProfileForm user={mockUser} />
      </main>
    </ProfilePageLayout>
  );
}