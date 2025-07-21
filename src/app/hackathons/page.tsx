import Link from 'next/link';
import prisma from '@/lib/db'; // Assuming your prisma client is here
import { Calendar, Globe } from 'lucide-react';

// This is an async Server Component
export default async function HackathonsPage() {
  const hackathons = await prisma.hackathon.findMany({
    orderBy: {
      startDate: 'asc',
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Hackathons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Find your next challenge and collaborate with innovators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      </main>
    </div>
  );
}

// A smaller, reusable component for the card UI
function HackathonCard({ hackathon }: { hackathon: any }) {
  const formattedStartDate = new Date(hackathon.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formattedEndDate = new Date(hackathon.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Link href={`/hackathons/${hackathon.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
        <img className="h-48 w-full object-cover" src={hackathon.imageUrl} alt={hackathon.name} />
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{hackathon.name}</h2>
          <p className="text-gray-600 text-sm flex-grow mb-4">{hackathon.description.substring(0, 100)}...</p>
          <div className="mt-auto space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>{formattedStartDate} - {formattedEndDate}</span>
            </div>
            {hackathon.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-500" />
                <span className="truncate">{hackathon.website.replace('https://', '')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}   