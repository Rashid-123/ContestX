

'use client';

import { useAuth } from "@/context/AuthContext";
import Activity from "@/components/Activity";
import Heatmap from "@/components/Heatmap";
import RefreshButton from "@/components/RefreshButton";
import POD from "@/components/POD";
import Hero from "@/components/Hero";
import { SiLeetcode } from "react-icons/si";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <>
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    </>;

  }

  return (
    <>
      {!user && <Hero />}

      {user && (
        <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
          <div className="flex justify-between items-center p-3 md:py-4 md:px-6 rounded-2xl   gap-2 md:gap-4">
            <div className="flex items-center">
              <SiLeetcode className="w-5 h-5 md:w-6 md:h-6 mr-2 text-yellow-500" />
              <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 truncate">
                Dashboard
              </h2>
            </div>
            <RefreshButton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <POD />
            {<Heatmap username={user.leetcode} />}
          </div>
          {<Activity username={user.leetcode} />}
        </div>
      )}
    </>
  );
}