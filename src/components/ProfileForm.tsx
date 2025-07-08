"use client";

import { useState, useEffect, useRef } from "react";
import {
  Eye,
  LoaderCircle,
  Upload,
  Check,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import ResumeUploader from "./ResumeUploader";
import { useRouter } from "next/navigation";

type ProfileData = {
  name: string;
  bio: string;
  linkedin: string;
  leetcode: string;
  profilePic?: string | null;
  resumeUrl?: string | null;
};

type ProfileFormProps = {
  user: ProfileData;
  isOwner: boolean;
};

export default function ProfileForm({ user, isOwner }: ProfileFormProps) {
  const router = useRouter();
  const pfpInputRef = useRef<HTMLInputElement>(null);

  // State for form fields
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    bio: "",
    linkedin: "",
    leetcode: "",
    profilePic: null,
    resumeUrl: null,
  });

  // State for UI feedback
  const [isSaving, setIsSaving] = useState(false);
  const [isPfpUploading, setIsPfpUploading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [pfpPreview, setPfpPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for resume blob URL
  const [resumeBlobUrl, setResumeBlobUrl] = useState<string | null>(null);

  // Initialize form data from props
  useEffect(() => {
    setFormData({
      name: user.name || "",
      bio: user.bio || "",
      linkedin: user.linkedin || "",
      leetcode: user.leetcode || "",
      profilePic: user.profilePic || null,
      resumeUrl: user.resumeUrl || null,
    });
    setPfpPreview(null);
  }, [user]);

  // Fetch resume from backend on mount or user change
  useEffect(() => {
    let url: string | null = null;
    async function fetchResume() {
      try {
        const res = await fetch("/api/profile/me/upload-resume");
        if (res.ok) {
          const blob = await res.blob();
          url = URL.createObjectURL(blob);
          setResumeBlobUrl(url);
        } else {
          setResumeBlobUrl(null);
        }
      } catch {
        setResumeBlobUrl(null);
      }
    }
    fetchResume();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [user]);

  // All fields are locked unless editing
  const isReadOnly = !isEditing || !isOwner;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    try {
      const response = await fetch("/api/profile/me/upload-pfp", {
        method: "POST",
        headers: { "content-type": file.type, "x-vercel-filename": file.name },
        body: file,
      });

      if (!response.ok)
        throw new Error("Profile picture upload failed. (Backend is offline)");

      setStatus({ type: "success", message: "Picture updated!" });
      router.refresh();
    } catch (error: any) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsPfpUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/profile/me/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save.");

      setStatus({ type: "success", message: "Profile saved successfully!" });
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={pfpPreview || formData.profilePic || "/default-profile.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-white"
            />
            {isOwner && isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => pfpInputRef.current?.click()}
                  disabled={isPfpUploading}
                  className="absolute -bottom-2 -right-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 disabled:bg-orange-300"
                >
                  {isPfpUploading ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="file"
                  ref={pfpInputRef}
                  onChange={handlePfpChange}
                  accept="image/*"
                  hidden
                />
              </>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
            <p className="text-sm text-gray-500">
              Personal and professional details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              readOnly={isReadOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us a bit about yourself..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              readOnly={isReadOnly}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedin"
              id="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              readOnly={isReadOnly}
            />
          </div>
          <div>
            <label
              htmlFor="leetcode"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              LeetCode URL
            </label>
            <input
              type="url"
              name="leetcode"
              id="leetcode"
              value={formData.leetcode}
              onChange={handleInputChange}
              placeholder="https://leetcode.com/..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              readOnly={isReadOnly}
            />
          </div>
        </div>

        {/* Resume section with blob viewer (always visible if resume exists) */}
<div className="mt-6">
  <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">
    Resume (PDF)
  </label>
  <div className="flex items-center mb-2">
    <ResumeUploader
      currentResumeUrl={formData.resumeUrl || undefined}
      disabled={!isEditing || !isOwner}
    />
    {resumeBlobUrl && (
      <a
        href={resumeBlobUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition group"
        title="View Resume"
      >
        <Eye className="w-5 h-5 text-gray-700 group-hover:text-orange-600" />
        <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600">
          View Resume
        </span>
      </a>
    )}
  </div>
  {resumeBlobUrl ? (
    <>
      <p className="text-xs text-gray-500 mt-1">
        Resume uploaded. <span className="text-orange-600">Click the eye to view in a new tab or see below.</span>
      </p>
      {/* Inline PDF viewer */}
      <div className="mt-4 border rounded shadow overflow-hidden w-full" style={{ height: "600px" }}>
        <iframe
          src={resumeBlobUrl}
          title="Resume PDF"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </>
    ) : (
      <p className="text-xs text-gray-500 mt-1">
        No resume uploaded yet.
      </p>
    )}
</div>
      </div>

      <div className="flex items-center justify-end gap-x-6 bg-gray-50 px-4 py-4 sm:px-6 rounded-b-xl">
        {status && (
          <div
            className={`flex items-center gap-2 text-sm ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.type === "success" ? (
              <Check size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
            {status.message}
          </div>
        )}
        {isOwner && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </button>
        )}
        {isOwner && isEditing && (
          <button
            type="submit"
            disabled={isSaving || isPfpUploading}
            className="ml-auto flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50"
          >
            {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </form>
  );
}
