'use client';

import React, { useState } from 'react';

export default function CreateProjectPopup({ onClose, onCreate }: {
  onClose: () => void,
  onCreate: (projectData: any) => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    complexity: '',
    techStack: '',
    roles: '',
    expertiseLevels: '',
    peopleRequired: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse comma-separated values
    const techStackArray = formData.techStack.split(',').map(s => s.trim()).filter(Boolean);
    const rolesArray = formData.roles.split(',').map(s => s.trim()).filter(Boolean);
    const expertiseArray = formData.expertiseLevels.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    const peopleArray = formData.peopleRequired.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

    // Validate inputs
    if (rolesArray.length !== expertiseArray.length || rolesArray.length !== peopleArray.length) {
      alert('Roles, expertise levels, and people required must have the same number of entries');
      return;
    }

    // Prepare required roles
    const requiredRoles = rolesArray.map((role, idx) => ({
      role,
      expertiseLevel: expertiseArray[idx],
      peopleRequired: peopleArray[idx]
    }));

    onCreate({
      title: formData.title,
      description: formData.description,
      complexity: formData.complexity,
      techStack: techStackArray,
      requiredRoles
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div>
            <label className="block font-semibold">Complexity</label>
            <input
              type="text"
              name="complexity"
              value={formData.complexity}
              onChange={handleChange}
              placeholder="Low, Medium, High"
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div>
            <label className="block font-semibold">Tech Stack (comma separated)</label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, MySQL"
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div>
            <label className="block font-semibold">Roles (comma separated)*</label>
            <input
              type="text"
              name="roles"
              value={formData.roles}
              onChange={handleChange}
              placeholder="Backend Developer, UI/UX Designer"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div>
            <label className="block font-semibold">Expertise Levels (comma separated numbers)*</label>
            <input
              type="text"
              name="expertiseLevels"
              value={formData.expertiseLevels}
              onChange={handleChange}
              placeholder="7, 5"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div>
            <label className="block font-semibold">People Required (comma separated numbers)*</label>
            <input
              type="text"
              name="peopleRequired"
              value={formData.peopleRequired}
              onChange={handleChange}
              placeholder="2, 1"
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
