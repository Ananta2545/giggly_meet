"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "./components/Loader";
import Header from "./components/Header";
import MeetingActions from "./components/MeetingActions";
import MeetingFeature from "./components/MeetingFeature";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(false);
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      if (!hasShownWelcome) {
        toast.success(`Welcome back ${session?.user?.name}`);
        localStorage.setItem('hasShownWelcome', 'true');
      }
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
      toast.error("Please login to continue");
    }
  }, [session, status])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 1s ease-out;
        }
      `}</style>

      <Header />
      <main className="flex-grow p-8 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 animate-slideUp">
              <h1
                className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg"
              >
                Talk. Laugh. Repeat.
              </h1>
              <p className="text-2xl text-gray-700 dark:text-gray-300 mb-12 italic animate-fadeIn">
                From awkward silences to unexpected cat cameos — Giggly Meet brings the magic of remote chaos right to your screen 🎉🐱
              </p>
              <MeetingActions />
            </div>
            <div className="md:w-1/2 animate-fadeIn">
              <MeetingFeature />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
