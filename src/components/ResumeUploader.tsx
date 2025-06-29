'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, LoaderCircle, CheckCircle, XCircle } from 'lucide-react';

type ResumeUploaderProps = {
  currentResumeUrl: string | null | undefined;
};

export default function ResumeUploader({ currentResumeUrl }: ResumeUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setStatus(null);
    } else {
      setSelectedFile(null);
      setStatus({ type: 'error', message: 'Invalid file. Please select a PDF.' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setStatus(null);

    // This fetch will also fail until its backend is enabled.
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      const response = await fetch('/api/profile/upload-resume', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed. (Backend is offline)');
      setStatus({ type: 'success', message: 'Resume uploaded successfully!' });
      setSelectedFile(null);
      router.refresh();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Resume</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <div className="flex items-center gap-3 flex-shrink-0">
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors">
            Choose PDF
          </button>
          {selectedFile && (
            <button type="button" onClick={handleUpload} disabled={isUploading} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 disabled:bg-orange-400 transition-colors">
              {isUploading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
        <div className="text-sm w-full">
          {!selectedFile && currentResumeUrl && (
            <a href={currentResumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium text-orange-600 hover:underline">
              <FileText className="w-4 h-4" /> View Current Resume
            </a>
          )}
          {!selectedFile && !currentResumeUrl && <p className="text-gray-500">No resume uploaded yet.</p>}
          {selectedFile && <p className="text-gray-600">Selected: <span className="font-medium">{selectedFile.name}</span></p>}
          {status && (
            <div className={`mt-2 flex items-center gap-2 ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{status.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}