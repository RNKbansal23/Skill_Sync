"use client";

import React, { useEffect } from "react";

export default function ProjectDetailsPopup({
  projectId,
  onClose,
}: {
  projectId: number;
  onClose: () => void;
}) {
  const [project, setProject] = React.useState<any>(null);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch(console.error);
  }, [projectId]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">{project.title}</h2>
        <p className="mb-2"><strong>Description:</strong> {project.description}</p>
        <p className="mb-2"><strong>Owner:</strong> {project.owner?.name}</p>
        <p className="mb-2"><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
        <div className="mt-4">
          <h3 className="font-semibold">Required Roles</h3>
          <ul className="space-y-2">
            {project.requiredRoles?.map((role: any) => (
              <li key={role.id}>
                {role.role} (Expertise: {role.expertiseLevel}, People Needed: {role.peopleRequired})
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
