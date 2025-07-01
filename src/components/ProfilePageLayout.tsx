'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar'; // We're using your existing Sidebar
import { ChevronRight } from 'lucide-react';

// This component will wrap your profile page content
export default function ProfilePageLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Your existing Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* The orange button to open the sidebar */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/7 left-0 z-30 w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-r-lg shadow-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-110
                  ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Toggle navigation"
      >
        <ChevronRight size={28} />
      </button>

      {/* This is where the actual page content (from page.tsx) will be rendered */}
      {children}
    </div>
  );
}