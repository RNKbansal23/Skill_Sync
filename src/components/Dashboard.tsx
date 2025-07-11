"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from "lucide-react";
import ProjectDetailsPopup from "./ProjectDetailsPopup";
import CreateProjectPopup from "./CreateProjectPopup"; 
import { useRouter } from "next/navigation";


export default function Dashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ projectId: number, roleId: number } | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects/me");
        const data = await res.json();
        console.log(data);
        if (res.ok && data.projects) {
          const projectRolePairs = data.projects.flatMap((project) => 
          project.requiredRoles.map((role) => ({
            project, role,
          })));
          setProjects(projectRolePairs);
        } else {
          setProjects([]);
        }
      } catch (e) {
        setProjects([]);
      }
    }
    fetchProjects();
    console.log(user);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCreateProject = (projectData) => {
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    })
      .then((res) => res.json())
      .then((newProject) => {
        setProjects([...projects, newProject]);
        setShowPopup(false);
      })
      .catch((err) => {
        console.error("Failed to create project:", err);
        alert("Failed to create project");
      });
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="relative min-h-screen bg-gray-50">
        <button
          onClick={toggleSidebar}
          className={`fixed top-1/2 -translate-y-1/2 left-4 z-30 w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-110
                    ${
                      isSidebarOpen
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    }`}
          aria-label="Toggle navigation"
        >
          <ChevronRight size={24} />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? "ml-64" : "ml-0"} pt-20`}
        >
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-6 mb-10">
              <div className="relative">
                <a href="/profile" className="block">
                  <img
                    src={user.profilePic || "/default-profile.jpg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-orange-400 object-cover"
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Profile
                  </span>
                </a>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* My Projects Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-lg font-bold text-orange-500 mb-4">
    My Project Roles
  </h2>
  {projects.length === 0 ? (
    <p className="text-gray-500">No roles yet.</p>
  ) : (
    <ul className="space-y-3">
      {projects.map(({ project, role }, idx) => (
        <li
          key={role.id ?? `projectrole-${idx}`}
          onClick={() => setSelectedProject({ projectId: project.id, roleId: role.id })}
          className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <div>
            <span className="font-semibold text-gray-700">
              {project.title}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              (Role: {role.role}, Expertise: {role.expertiseLevel}, Needed: {role.peopleRequired})
            </span>
          </div>
          {/* Add more fields or actions as needed */}
        </li>
      ))}
    </ul>
  )}
  <button
    onClick={() => setShowPopup(true)}
    className="block mt-5 text-orange-600 font-semibold hover:underline text-sm"
  >
    + Create New Project
  </button>
</div>


              {/* Recommendations Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold text-orange-500 mb-4">
                  Recommended For You
                </h2>
                {user.recommendations.length === 0 ? (
                  <p className="text-gray-500">No recommendations yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {user.recommendations.map((rec) => (
                      <li
                        key={rec.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700">{rec.title}</span>
                        <button className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-orange-600 transition-colors">
                          Join
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Events Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold text-orange-500 mb-4">
                  Upcoming Events
                </h2>
                {user.events.length === 0 ? (
                  <p className="text-gray-500">No events.</p>
                ) : (
                  <ul className="space-y-3">
                    {user.events.map((event) => (
                      <li
                        key={event.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700">{event.name}</span>
                        <span className="text-sm text-gray-500">
                          {event.date}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

           <div className="bg-white rounded-xl shadow-md p-6 mt-8 hover:shadow-lg transition-shadow">
  {/* <h2 className="text-lg font-bold text-orange-500 mb-4">
    Review Applications
  </h2>
  {user.ownedProjects && user.ownedProjects.length === 0 ? (
    <p className="text-gray-500">You have not created any projects yet.</p>
  ) : (
    <div className="space-y-6">
      {user.ownedProjects.map((project) => (
        <div key={project.id}>
          <h3 className="font-semibold text-gray-800 mb-2">{project.title}</h3>
          {project.requiredRoles && project.requiredRoles.length > 0 ? (
            <ul className="space-y-2">
              {project.requiredRoles.map((role) => (
                <li
                  key={role.id}
                  className="cursor-pointer text-gray-700 font-medium border rounded p-3 hover:bg-orange-50 hover:text-orange-600 transition"
                  onClick={() =>
                    router.push(`/dashboard/projects/${project.id}/roles/${role.id}`)
                  }
                >
                  {role.role} ({role.expertiseLevel}) — {role.peopleRequired} needed
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No roles defined for this project.</p>
          )}
        </div>
      ))}
    </div>
  )}
</div> */}
          </main>
        </div>

        {showPopup && (
          <CreateProjectPopup
            onClose={() => setShowPopup(false)}
            onCreate={handleCreateProject}
          />
        )}

        {selectedProject && (
          <ProjectDetailsPopup
            projectId={selectedProject.projectId}
            roleId = {selectedProject.roleId}
            onClose={() => setSelectedProject(null)}
            currentUserId={user.id}
          />
        )}
      </div>
    </>
  );
}
