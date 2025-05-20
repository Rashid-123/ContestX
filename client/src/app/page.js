
'use client';

import { useAuth } from "@/context/AuthContext";
// import LeetCodeHeatmap from "@/components/LeetCodeHeatmap";
// import Leetcode_activity from "@/components/LeetCode_activity";
// import RefreshButton from "@/components/RefreshButton";
// import POD from "@/components/POD";
import Hero from "@/components/Hero";
export default function Home() {
  const { user, token } = useAuth();

  return (
    <>
    <Hero />
     {/* <div className="container mx-auto px-4 py-8 flex flex-col gap-4">

     {user?.leetcode && (<div className="container mx-auto px-4 py-8 flex flex-col gap-4" >

       <div className="flex justify-between items-center p-3 md:py-4 md:px-6  bg-white rounded-2xl border border-gray-200 gap-2 md:gap-4" >

         <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">LeetCode Dashboard</h2>

         <RefreshButton className="flex-shrink-0" />
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         <POD />
          <LeetCodeHeatmap username={user.leetcode} />
        </div>

        <Leetcode_activity username={user.leetcode} />

      </div>
      )} </div>  */}
      </>
    );

}