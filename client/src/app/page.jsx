
// 'use client';

// import { useAuth } from "@/context/AuthContext";
// import LeetCodeHeatmap from "@/components/LeetCodeHeatmap";
// import Leetcode_activity from "@/components/LeetCode_activity";
// import RefreshButton from "@/components/RefreshButton";
// import POD from "@/components/POD";
// import Hero from "@/components/Hero";
// import { SiLeetcode } from "react-icons/si";
// export default function Home() {
//   const { user, token, loading } = useAuth();

//   return (
//     <>
//       {/* <Hero /> */}
//       {!user && <Hero />}
//       <div className="container mx-auto   flex flex-col gap-4">

//         {user && (<div className="container mx-auto px-4 py-8 flex flex-col gap-4" >

//           <div className="flex justify-between items-center p-3 md:py-4 md:px-6  bg-white rounded-2xl border border-gray-200 gap-2 md:gap-4" >

//             <div className="flex items-center "> <SiLeetcode className="w-5 h-5 mr-2 text-yellow-500 " /> <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">  Dashboard   </h2></div>
//             <RefreshButton />
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <POD />
//             <LeetCodeHeatmap username={user.leetcode} />
//           </div>

//           <Leetcode_activity username={user.leetcode} />

//         </div>)}
//       </div>
//     </>
//   );

// }


'use client';

import { useAuth } from "@/context/AuthContext";
import LeetCodeHeatmap from "@/components/LeetCodeHeatmap";
import Leetcode_activity from "@/components/LeetCode_activity";
import RefreshButton from "@/components/RefreshButton";
import POD from "@/components/POD";
import Hero from "@/components/Hero";
import GooeyDotsSpinner from "@/components/GooeyDotsSpinner";
import { SiLeetcode } from "react-icons/si";

export default function Home() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <><GooeyDotsSpinner /></>

  }

  return (
    <>
      {!user && <Hero />}

      {user && (
        <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
          <div className="flex justify-between items-center p-3 md:py-4 md:px-6 bg-white rounded-2xl border border-gray-200  gap-2 md:gap-4">
            <div className="flex items-center">
              <SiLeetcode className="w-5 h-5 mr-2 text-yellow-500" />
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                Dashboard
              </h2>
            </div>
            <RefreshButton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <POD />
            {user.leetcode && <LeetCodeHeatmap username={user.leetcode} />}
          </div>
          {user.leetcode && <Leetcode_activity username={user.leetcode} />}
        </div>
      )}
    </>
  );
}