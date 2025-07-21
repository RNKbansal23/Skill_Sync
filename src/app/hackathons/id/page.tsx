// src/app/hackathons/[id]/page.tsx

// All your imports can stay the same
// import prisma from '@/lib/db'; // You can comment this out for now
import { notFound } from 'next/navigation';
import { Calendar, Globe, Users, UserPlus } from 'lucide-react';
import HackathonActions from '@/components/HackathonActions'; 

// --- MOCK DATA for Frontend Development ---
const mockHackathon = {
  id: 1,
  name: 'Synergy AI Challenge',
  description: `This is a premier event for AI enthusiasts and developers. 
  
  Participants will have the opportunity to work on real-world problems, develop innovative solutions, and showcase their skills to a panel of industry experts. 
  
  Join us to collaborate, learn, and push the boundaries of what's possible with artificial intelligence.`,
  startDate: new Date('2024-10-26T09:00:00Z'),
  endDate: new Date('2024-10-28T17:00:00Z'),
  website: 'https://synergy-hacks.com',
  imageUrl: 'https://images.unsplash.com/photo-1593349122512-c54c4a359e95?q=80&w=2070&auto=format&fit=crop', // A nice placeholder
  seekingUsers: [
    { id: 101, name: 'Alice Johnson', profile: { profilePic: 'https://i.pravatar.cc/150?u=alice' } },
    { id: 102, name: 'Bob Williams', profile: { profilePic: 'https://i.pravatar.cc/150?u=bob' } },
  ],
};
// --- END MOCK DATA ---


export default async function HackathonDetailPage({ params }: { params: { id:string } }) {
  // We'll use our mock data instead of fetching from prisma
  const hackathon = mockHackathon;

  if (!hackathon) {
    notFound();
  }
  
  const formattedStartDate = new Date(hackathon.startDate).toLocaleString('en-US', { dateStyle: 'full' });
  const formattedEndDate = new Date(hackathon.endDate).toLocaleString('en-US', { dateStyle: 'full' });

  // The rest of your JSX remains exactly the same.
  return (
    <div className="bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <img src={hackathon.imageUrl || ''} alt={hackathon.name} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
            <div className="absolute bottom-0 left-0 p-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{hackathon.name}</h1>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Hackathon</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{hackathon.description}</p>
                </div>
                {/* ... other detail sections ... */}
            </div>

            {/* Right Column: Actions & Participants */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Actions</h3>
                    <HackathonActions hackathonId={hackathon.id} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5"/> Looking for a Team</h3>
                    <ul className="space-y-3">
                        {hackathon.seekingUsers.length > 0 ? (
                            hackathon.seekingUsers.map(user => (
                                <li key={user.id} className="flex items-center gap-3">
                                    <img src={user.profile?.profilePic || '/default-profile.jpg'} alt={user.name || ''} className="w-8 h-8 rounded-full"/>
                                    <span className="font-medium text-gray-700">{user.name}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No one is looking for a team yet.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}