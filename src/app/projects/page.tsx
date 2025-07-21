"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from 'lucide-react'
import ProjectDetailsPopup from "@/components/ProjectDetailsPopup";
import { useUser } from '@/components/UserContextProvider';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<{ projectId: number, roleId: number } | null>(null);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useUser();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (search.trim() === "") {
      fetch("/api/projects/search")
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          // If your API returns { projects: [...] }
          const projectRolePairs = data.projects.flatMap((project) =>
            project.requiredRoles.map((role) => ({
              project,
              role,
            }))
          );
          setProjects(projectRolePairs);
        });
    }
  }, [search]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;

    const res = await fetch(
      `/api/projects/search?q=${encodeURIComponent(search)}`
    );
    const data = await res.json();

    const projectRolePairs = data.projects.flatMap((project) =>
      project.requiredRoles.map((role) => ({
        project,
        role,
      }))
    );
    setProjects(projectRolePairs);
  }

  return (
  <>
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 -translate-y-1/2 left-4 z-30 w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 ${
          isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Toggle navigation"
      >
        <ChevronRight size={24} />
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'} pt-24 px-4`}>
        <h1 className="text-2xl font-bold text-orange-500 text-center">Browse Projects</h1>
        
        <form className="mt-5 flex justify-center" onSubmit={handleSearch}>
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Any project you want to work on?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded-full w-full pl-12 py-3 text-xl"
            />
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </form>

        <div className="mt-8">
          {projects.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(({ project, role }) => (
                <li
                  key={`${project.id}-${role.id}`}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                  onClick={() => setSelectedProject({ projectId: project.id, roleId: role.id })}
                >
                  <h3 className="font-semibold text-orange-500 text-lg">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{project.description}</p>
                  <p className="text-sm text-gray-700">Owner: {project.owner.name}</p>
                  <p className="text-sm text-gray-700">Role: {role.title}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsPopup
          projectId={selectedProject.projectId}
          roleId={selectedProject.roleId}
          onClose={() => setSelectedProject(null)}
          currentUserId={user?.id}
        />
      )}
    </div>
  </>
);
}
