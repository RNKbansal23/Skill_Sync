'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ChevronRight } from 'lucide-react';

export default function ProfilePageLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  return (
    <div className="relative min-h-screen bg-gray-50 flex">
      {/* Sidebar: overlays on mobile, sticky on desktop */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Orange button to open sidebar (hidden if sidebar is open or on desktop) */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-8 left-0 z-30 w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-r-lg shadow-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-110
          ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} lg:hidden`}
        aria-label="Toggle navigation"
      >
        <ChevronRight size={28} />
      </button>

      {/* Overlay when sidebar is open (mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'pointer-events-none blur-sm select-none' : ''
        }`}
      >
        {children}
      </main>
    </div>
  );
}
