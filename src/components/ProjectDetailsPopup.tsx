'use client';

import { useState, useEffect } from 'react';
import { X, LoaderCircle, User, Calendar, Briefcase, Info } from 'lucide-react';

type ProjectDetailsPopupProps = {
  projectId: number;
  roleId: number;
  onClose: () => void;
  currentUserId: number;
};

export default function ProjectDetailsPopup({ projectId, roleId, currentUserId, onClose }: ProjectDetailsPopupProps) {
  const [project, setProject] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to control the open/close animation
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        console.log('project: ', projectId)
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Failed to fetch project details.');
        const data = await res.json();
        setProject(data);
        // Find the specific role by roleId
        const foundRole = data.requiredRoles.find((r: any) => r.id === roleId);
        setRole(foundRole);
        console.log(data.owner.id, currentUserId);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();

    // Trigger the "enter" animation
    const timer = setTimeout(() => setShow(true), 50);

    return () => clearTimeout(timer);
  }, [projectId, roleId]);

  const handleRequestToJoin = async () => {
    if (!role) {
      alert('Role not found!');
      return;
    }
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          projectRequiredRoleId: role.id,
        }),
      });
      if (!res.ok) throw new Error('Failed to apply');
      alert('Application sent!');
      handleClose();
    } catch (err: any) {
      alert('Could not apply: ' + err.message);
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };


  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out
                  ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out
                    ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="flex justify-center items-center h-64">
            <LoaderCircle className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center p-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && project && role && (
          <div className="p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{project.title}</h2>

            <div className="space-y-5 mt-6">
              {/* Description Section */}
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </div>

              {/* Owner and Date Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Owner</h3>
                    <p className="text-gray-600">{project.owner.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-700">Created</h3>
                    <p className="text-gray-600">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Single Role Section */}
              <div className="flex items-start gap-4">
                <Briefcase className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-700">Role</h3>
                  <div>
                    <span className="font-semibold">{role.role}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      (Expertise: {role.expertiseLevel}, Needed: {role.peopleRequired})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with action buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            {project.owner.id !== currentUserId && (
              <button
                className="px-6 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                onClick={handleRequestToJoin}
              >
                Request to Join
              </button>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
