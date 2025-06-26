'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Mock data for demonstration
const mockUser = {
  name: 'Ainesh',
  profilePic: '/profile.jpg',
  profileCompletion: 80,
  projects: [
    { id: 1, title: 'AI Resume Builder', status: 'Active' },
    { id: 2, title: 'Hackathon Team Finder', status: 'Completed' },
  ],
  recommendations: [
    { id: 3, title: 'Eco-Friendly Delivery Service' },
    { id: 4, title: 'Mental Health Support Bot' },
  ],
  events: [
    { id: 5, name: 'Global Hackathon 2025', date: 'July 15, 2025' },
  ],
  activity: [
    { id: 1, text: 'You joined "AI Resume Builder"' },
    { id: 2, text: 'Anna sent you a message' },
    { id: 3, text: 'Project "Team Finder" updated' },
  ],
}

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetch('../api/projects/myprojects')
    .then(res=>res.json())
    .then(data => setProjects(data))
  })

  console.log(projects)
  // In a real app, fetch user data from API
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Simulate API call
    setUser(mockUser)
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-orange-400"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user.name}!
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-40 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full"
                  style={{ width: `${user.profileCompletion}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                Profile {user.profileCompletion}%
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* My Projects */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-bold text-orange-500 mb-3">My Projects</h2>
            {user.projects.length === 0 ? (
              <p className="text-gray-500">No projects yet.</p>
            ) : (
              <ul>
                {user.projects.map((proj: any) => (
                  <li key={proj.id} className="mb-2 flex justify-between items-center">
                    <span className="font-semibold">{proj.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${proj.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {proj.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/projects/create" className="block mt-4 text-orange-500 hover:underline text-sm">
              + Create New Project
            </Link>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-bold text-orange-500 mb-3">Recommended For You</h2>
            {user.recommendations.length === 0 ? (
              <p className="text-gray-500">No recommendations yet.</p>
            ) : (
              <ul>
                {user.recommendations.map((rec: any) => (
                  <li key={rec.id} className="mb-2 flex justify-between items-center">
                    <span>{rec.title}</span>
                    <button className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs hover:bg-orange-600">
                      Join
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Events */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-bold text-orange-500 mb-3">Upcoming Events</h2>
            {user.events.length === 0 ? (
              <p className="text-gray-500">No events.</p>
            ) : (
              <ul>
                {user.events.map((event: any) => (
                  <li key={event.id} className="mb-2 flex justify-between items-center">
                    <span>{event.name}</span>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-5 mt-8">
          <h2 className="text-lg font-bold text-orange-500 mb-3">Recent Activity</h2>
          {user.activity.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <ul>
              {user.activity.map((act: any) => (
                <li key={act.id} className="mb-1 text-gray-700">
                  • {act.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
