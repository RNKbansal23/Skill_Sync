'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import Sidebar from '@/components/Sidebar' // Make sure this path is correct
import { ChevronRight } from 'lucide-react'


export default function Dashboard({ user }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/me/projects')
      .then(res => res.json())
      .then(data => setProjects(data.projects));
  }, []);

  const [isSidebarOpen, setSidebarOpen] = useState(false) // State for the sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  if (!user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="relative min-h-screen">
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <button
        onClick={toggleSidebar}
        className={`fixed top-20 left-4 z-30 w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-lg shadow-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-110
                  ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Toggle navigation"
      >
        <ChevronRight size={28} />
      </button>

      <div
        className={`transition-transform duration-300 ease-in-out
                  ${isSidebarOpen ? 'transform translate-x-64' : 'transform translate-x-0'}`}
      >

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-orange-400 object-cover"
              />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">Profile</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user.name}!
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-48 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: `${user.profileCompletion}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  Profile {user.profileCompletion}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-bold text-orange-500 mb-4">My Projects</h2>
              {user.projects.length === 0 ? (
                <p className="text-gray-500">No projects yet.</p>
              ) : (
                <ul className="space-y-3">
                  {user.projects.map((proj: any) => (
                    <li key={proj.id} className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">{proj.title}</span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${proj.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {proj.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/projects/create" className="block mt-5 text-orange-600 font-semibold hover:underline text-sm">
                + Create New Project
              </Link>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-bold text-orange-500 mb-4">Recommended For You</h2>
              {user.recommendations.length === 0 ? (
                <p className="text-gray-500">No recommendations yet.</p>
              ) : (
                <ul className="space-y-3">
                  {user.recommendations.map((rec: any) => (
                    <li key={rec.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{rec.title}</span>
                      <button className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-orange-600 transition-colors">
                        Join
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Events */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-bold text-orange-500 mb-4">Upcoming Events</h2>
              {user.events.length === 0 ? (
                <p className="text-gray-500">No events.</p>
              ) : (
                <ul className="space-y-3">
                  {user.events.map((event: any) => (
                    <li key={event.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{event.name}</span>
                      <span className="text-sm text-gray-500">{event.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-orange-500 mb-4">Recent Activity</h2>
            {user.activity.length === 0 ? (
              <p className="text-gray-500">No recent activity.</p>
            ) : (
              <ul className="space-y-2">
                {user.activity.map((act: any) => (
                  <li key={act.id} className="text-gray-700 list-disc list-inside">
                    {act.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
