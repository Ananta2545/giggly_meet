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
  const {data:session, status} = useSession();
  // console.log(session);
  // console.log(status);

  useEffect(()=>{
    if(status === 'authenticated'){
      setIsLoading(false);
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      if(!hasShownWelcome){
        toast.success(`Welcome back ${session?.user?.name}`);
        localStorage.setItem('hasShownWelcome', 'true');
      }
    }else if(status === 'unauthenticated'){
      setIsLoading(false);
      toast.error("Please login to continue");
    }
  }, [session, status])

  if(isLoading){
    return <Loader/>
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header/>
      <main className="flex-grow p-8 pt-32 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Video Calls and Meetings for Everyone
              </h1>
              <p className="text-3xl text-gray-600 dark:text-gray-300 mb-12">Connect, Collaborate and celebrate from anywhere with Giggly Meet</p>
              <MeetingActions/>
            </div>
            <div className="md:w-1/2">
              <MeetingFeature/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
