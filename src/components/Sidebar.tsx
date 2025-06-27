'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, LayoutDashboard, Rocket, FolderKanban, LogOut } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login'); // or '/' if you want to go to the homepage
      window.location.replace('/login')
    } catch (err) {
      alert('Error logging out');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gray-800 text-white p-6 z-50
                   transform transition-transform duration-300 ease-in-out ${
                     isOpen ? 'translate-x-0' : '-translate-x-full'
                   }`}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-orange-400">Navigation</h2>
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/hackathons" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors">
                <Rocket size={20} />
                <span>Available Hackathons</span>
              </Link>
            </li>
            <li>
              <Link href="/projects" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors">
                <FolderKanban size={20} />
                <span>Available Projects</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors w-full text-left"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  )
}
