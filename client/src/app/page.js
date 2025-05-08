// "use client";

// import { useAuth } from "@/context/AuthContext";
// import LeetCodeHeatmap from "@/components/leetcodeHeatmap";
// import Leetcode_activity from "@/components/Leetcode_activity";
// import POD from "@/components/POD";
// export default function Home() {
//   const { user, token } = useAuth();
//   return (

//     <>

//       {user?.leetcode &&
//         (<div>
//           <LeetCodeHeatmap username={user.leetcode} />
//           <Leetcode_activity username={user.leetcode} />
//           <POD />
//         </div>

//         )}
//     </>
//   );
// }



'use client';

import { useAuth } from "@/context/AuthContext";
import LeetCodeHeatmap from "@/components/LeetCodeHeatmap";
import Leetcode_activity from "@/components/Leetcode_activity";
import RefreshButton from "@/components/RefreshButton";
import POD from "@/components/POD";

export default function Home() {
  const { user, token } = useAuth();
  
  return (
    <>
      {user?.leetcode && (
        
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-md">
              <h1 className="text-2xl font-bold">LeetCode Dashboard</h1>
              <RefreshButton />
            </div>
            <LeetCodeHeatmap username={user.leetcode} />
            <Leetcode_activity username={user.leetcode} />
            <POD />
          </div>
      )}
    </>
  );
}