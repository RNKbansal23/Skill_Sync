import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getProject(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) return notFound()

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-2">{project.title}</h1>
      <p className="text-gray-700 mb-6">{project.description}</p>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Team Members</h2>
        <ul className="flex flex-wrap gap-2">
          {project.team && project.team.length > 0 ? (
            project.team.map((member: any) => (
              <li key={member.id} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                {member.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No team members yet.</li>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Status</h2>
        <span className={`inline-block px-3 py-1 rounded-full text-xs ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
          {project.status}
        </span>
      </div>

      <div className="flex gap-4">
        <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
          Join Project
        </button>
        <Link href="/projects" className="text-orange-500 hover:underline self-center">
          ← Back to Projects
        </Link>
      </div>
    </div>
  )
}
