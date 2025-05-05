"use client";

import { useAuth } from "@/context/AuthContext";
import LeetCodeHeatmap from "@/components/leetcodeHeatmap";
import Leetcode_activity from "@/components/Leetcode_activity";
import POD from "@/components/POD";
export default function Home() {
  const { user, token } = useAuth();
  return (

    <>

      {user?.leetcode &&
        (<div>
          <LeetCodeHeatmap username={user.leetcode} />
          <Leetcode_activity username={user.leetcode} />
          <POD />
        </div>

        )}
    </>
  );
}