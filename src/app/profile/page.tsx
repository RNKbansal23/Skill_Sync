import ProfileForm from '@/components/ProfileForm'; // We will create this next
import { User, Profile } from '@prisma/client'; // Import types for structure

// Since the backend is disabled, we'll create a mock user object.
// This simulates the data your database would return.
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
    profilePic: 'https://i.pravatar.cc/150?u=rajatbansal', // A placeholder image service
    resumeUrl: null, // Initially no resume
  },
};


export default async function ProfilePage() {
  // Normally, you would fetch real user data here.
  // For now, we just pass our mock data to the client component.

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep your personal and professional details up-to-date.
          </p>
        </div>
        
        {/* We pass our mock user object to the form */}
        <ProfileForm user={mockUser} />

      </main>
    </div>
  );
}