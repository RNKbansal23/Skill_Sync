'use client'

import { useState } from 'react'

export default function CreateProjectPopup({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requiredRoles, setRequiredRoles] = useState([
    { role: '', expertiseLevel: '', peopleRequired: 1 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle changes for each field in a role
  const handleRoleChange = (idx, field, value) => {
    const updatedRoles = [...requiredRoles]
    updatedRoles[idx][field] = field === 'peopleRequired' ? Number(value) : value
    setRequiredRoles(updatedRoles)
  }

  const addRoleField = () =>
    setRequiredRoles([...requiredRoles, { role: '', expertiseLevel: '', peopleRequired: 1 }])

  const removeRoleField = (idx) => {
    if (requiredRoles.length === 1) return
    setRequiredRoles(requiredRoles.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Title is required')
      return
    }
    // Validate all roles
    for (const r of requiredRoles) {
      if (!r.role.trim() || !r.expertiseLevel.trim() || !r.peopleRequired) {
        alert('Please fill all fields for each required role.')
        return
      }
    }
    setIsSubmitting(true)
    await onCreate({
      title: title.trim(),
      description: description.trim(),
      requiredRoles,
    })
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-semibold mb-2 text-lg">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. AI Research Platform"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-semibold mb-2 text-lg">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={5}
              placeholder="Describe your project, goals, and vision..."
              disabled={isSubmitting}
            />
          </div>

          {/* Required Roles */}
          <div>
            <label className="block font-semibold mb-2 text-lg">
              Required Roles <span className="text-gray-500 text-base">(Add as many as you need)</span>
            </label>
            <div className="space-y-3">
              {requiredRoles.map((role, idx) => (
                <div key={idx} className="flex gap-2 flex-wrap items-end">
                  <input
                    type="text"
                    value={role.role}
                    onChange={e => handleRoleChange(idx, 'role', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Role (e.g. Frontend Developer)"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    value={role.expertiseLevel}
                    onChange={e => handleRoleChange(idx, 'expertiseLevel', e.target.value)}
                    className="w-40 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Expertise (e.g. Senior)"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="number"
                    min={1}
                    value={role.peopleRequired}
                    onChange={e => handleRoleChange(idx, 'peopleRequired', e.target.value)}
                    className="w-32 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="People Needed"
                    required
                    disabled={isSubmitting}
                  />
                  {requiredRoles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoleField(idx)}
                      className="bg-red-100 text-red-500 px-3 py-1 rounded hover:bg-red-200 transition"
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRoleField}
                className="mt-2 text-orange-600 font-semibold hover:underline"
                disabled={isSubmitting}
              >
                + Add Another Role
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
