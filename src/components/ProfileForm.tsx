'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Profile } from '@prisma/client';
import { LoaderCircle, Upload, Check, AlertTriangle } from 'lucide-react';
import ResumeUploader from './ResumeUploader'; // We'll create/reuse this next

// Define the prop type to include the nested profile
type ProfileFormProps = {
  user: User & { profile: Profile | null };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const pfpInputRef = useRef<HTMLInputElement>(null);

  // State for form fields, initialized with mock data
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.profile?.bio || '',
    linkedin: user.profile?.linkedin || '',
    leetcode: user.profile?.leetcode || '',
  });

  // State for UI feedback
  const [isSaving, setIsSaving] = useState(false);
  const [isPfpUploading, setIsPfpUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pfpPreview, setPfpPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePfpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPfpPreview(URL.createObjectURL(file));
    handlePfpUpload(file);
  };

  const handlePfpUpload = async (file: File) => {
    setIsPfpUploading(true);
    setStatus(null);
    
    // This `fetch` will fail until the backend is enabled.
    // The `catch` block will handle the error gracefully for UI testing.
    try {
      const response = await fetch('/api/profile/upload-pfp', {
        method: 'POST',
        headers: { 'content-type': file.type, 'x-vercel-filename': file.name },
        body: file,
      });

      if (!response.ok) throw new Error('Profile picture upload failed. (Backend is offline)');
      
      setStatus({ type: 'success', message: 'Picture updated!' });
      router.refresh(); 
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsPfpUploading(false);
      // In a real scenario, you might not clear the preview on error
      // setPfpPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    // This `fetch` will also fail until the backend is enabled.
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save. (Backend is offline)');

      setStatus({ type: 'success', message: 'Profile saved successfully!' });
      router.refresh();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={pfpPreview || user.profile?.profilePic || '/default-profile.jpg'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-white"
            />
            <button
              type="button"
              onClick={() => pfpInputRef.current?.click()}
              disabled={isPfpUploading}
              className="absolute -bottom-2 -right-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 disabled:bg-orange-300"
            >
              {isPfpUploading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </button>
            <input type="file" ref={pfpInputRef} onChange={handlePfpChange} accept="image/*" hidden />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <p className="text-sm text-gray-500">Update your photo and personal details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">Bio</label>
            <textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleInputChange} placeholder="Tell us a bit about yourself..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"></textarea>
          </div>
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-gray-900">LinkedIn URL</label>
            <input type="url" name="linkedin" id="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="leetcode" className="block text-sm font-medium leading-6 text-gray-900">LeetCode URL</label>
            <input type="url" name="leetcode" id="leetcode" value={formData.leetcode} onChange={handleInputChange} placeholder="https://leetcode.com/..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
          </div>
        </div>
        
        <ResumeUploader currentResumeUrl={user.profile?.resumeUrl} />
      </div>

      <div className="flex items-center justify-end gap-x-6 bg-gray-50 px-4 py-4 sm:px-6 rounded-b-xl">
        {status && (
          <div className={`flex items-center gap-2 text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
            {status.message}
          </div>
        )}
        <button
          type="submit"
          disabled={isSaving || isPfpUploading}
          className="ml-auto flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50"
        >
          {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}