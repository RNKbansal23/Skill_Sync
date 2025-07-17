// components/ProfileShell.tsx
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { ChevronRight } from 'lucide-react';
import ProfilePageLayout from './ProfilePageLayout';
import ProfileForm from './ProfileForm'; // already built

export default function ProfileShell({ user, isOwner }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 -translate-y-1/2 left-4 z-30 w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition duration-300 transform hover:scale-110 ${
          isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Toggle navigation"
      >
        <ChevronRight size={24} />
      </button>

      {/* Content that shifts right with Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} pt-12`}>
        <ProfilePageLayout>
          <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* ✅ This heading now shifts with the sidebar */}
            <h1 className="text-3xl font-bold text-gray-800 pt-6">
              Your Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Keep your personal and professional details up-to-date.
            </p>

            <ProfileForm user={user} isOwner={isOwner} />
          </main>
        </ProfilePageLayout>
      </div>
    </>
  );
}
