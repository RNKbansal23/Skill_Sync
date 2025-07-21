'use client';

import { useState, useEffect } from 'react';
// We don't need the router for this mock version
// import { useRouter } from 'next/navigation'; 
import { UserPlus, Search, LoaderCircle, CheckCircle, AlertTriangle } from 'lucide-react';

type HackathonActionsProps = {
  hackathonId: number;
};

export default function HackathonActions({ hackathonId }: HackathonActionsProps) {
  // State to track user's FAKE status
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  
  // UI feedback states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SIMULATE fetching initial user status
  useEffect(() => {
    console.log("Simulating: Checking user status...");
    setTimeout(() => {
      // You can change these initial values to test different states
      setIsRegistered(false);
      setIsSeeking(false);
      setIsLoading(false); // Finish loading
      console.log("Simulating: Status check complete.");
    }, 1500); // 1.5 second delay
  }, []);

  const handleRegister = async () => {
    setIsSubmitting(true);
    setError(null);
    console.log("Simulating: Registering for hackathon...");

    // SIMULATE an API call with a 1-second delay
    setTimeout(() => {
      setIsRegistered(true); // Update the state to change the UI
      setIsSubmitting(false);
      console.log("Simulating: Registration successful!");
      // Note: No router.refresh() is needed here.
    }, 1000);
  };

  const handleToggleSeeking = async () => {
    setIsSubmitting(true);
    setError(null);
    console.log("Simulating: Toggling 'seeking team' status...");

    // SIMULATE an API call with a 1-second delay
    setTimeout(() => {
      // Toggle the previous state
      setIsSeeking(prev => !prev); 
      setIsSubmitting(false);
      console.log("Simulating: Status toggled successfully!");
    }, 1000);
  };

  // The JSX part is identical to the previous version.
  // It just works because it depends only on the state variables we are controlling.

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <LoaderCircle className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleRegister}
        disabled={isRegistered || isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-orange-600 rounded-lg shadow-md hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting && !isRegistered ? <LoaderCircle className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
        {isRegistered ? 'Successfully Registered' : 'Register for Hackathon'}
      </button>

      {isRegistered && (
        <button
          onClick={handleToggleSeeking}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg shadow-md transition-all disabled:opacity-60 ${
            isSeeking 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {isSubmitting ? <LoaderCircle className="w-5 h-5 animate-spin" /> : (isSeeking ? <CheckCircle className="w-5 h-5" /> : <Search className="w-5 h-5" />)}
          {isSeeking ? 'You are Looking for a Team' : 'Look for a Team'}
        </button>
      )}

      {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle size={16} />
              <span>{error}</span>
          </div>
      )}
    </div>
  );
}