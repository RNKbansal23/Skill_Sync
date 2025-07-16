'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { ChevronRight } from 'lucide-react';

export default function RoleApplicationsPage() {
  const { projectId, roleId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        const res = await fetch(`/api/applications/by-role/${roleId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch applications');
        }
        setApplications(data.applications);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (roleId) {
      fetchApplications();
    }
  }, [roleId]);

  const handleDecision = async (applicationId: number, decision: 'accept' | 'reject') => {
  const res = await fetch(`/api/applications/${applicationId}/handle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: decision }),
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`${decision}ed successfully`, data);
    // Optionally: refresh page or remove from local state
  } else {
    alert(data.error || 'Something went wrong');
  }
};

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="relative min-h-screen bg-gray-50">
        <button
          onClick={toggleSidebar}
          className={`fixed top-1/2 -translate-y-1/2 left-4 z-30 w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 ${
            isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Toggle navigation"
        >
          <ChevronRight size={24} />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          } pt-20 px-6`}
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-orange-500 mb-6">
              Applications Received
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : applications.length === 0 ? (
              <p className="text-gray-500">No applications received yet.</p>
            ) : (
              <ul className="space-y-4">
                {applications.map((app: any) => (
                  <li
                    key={app.id}
                    className="bg-white shadow-sm rounded-md p-4 border hover:shadow transition"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={
                          app.user?.profile?.profilePicUrl ||
                          '/default-profile.jpg'
                        }
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                      <div>
                        <h2 className="font-semibold text-gray-800">
                          {app.user?.name ?? 'Unnamed'}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {app.user?.email}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied at:{' '}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                        <a
                          className="text-sm text-orange-600 underline mt-1 inline-block"
                          href={app.user?.profile?.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View LinkedIn
                        </a>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                            className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleDecision(app.id, 'accept')}
                        >
                            Accept
                        </button>
                        <button
                            className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleDecision(app.id, 'reject')}
                        >
                            Reject
                        </button>
                        </div>

                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
