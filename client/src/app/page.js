"use client";

import { useState, useEffect } from "react";
import GithubHeatmap from "@/components/GithubHeatmap";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Github_activity from "@/components/Github_activity";
import LeetCodeHeatmap from "@/components/leetcodeHeatmap";

export default function Home() {
  const { user, token } = useAuth();
  const [githubContributions, setGithubContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Reset states
      setError(null);
      
      // Don't attempt to fetch if no github username exists
      if (!user?.github) return;
      
      setIsLoading(true);
      
      try {
        const response = await axios.get(
          `https://github-contributions-api.deno.dev/${user.github}.json`
        );
        
        if (response.data && response.data.contributions) {
          setGithubContributions(response.data.contributions);
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setError("Failed to load GitHub contributions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.github]); // Only re-run when github username changes

  return (
    <>
      {isLoading && <div className="text-center py-4">Loading contributions...</div>}
      
      {error && <div className="text-red-500 py-4">{error}</div>}

      {user?.github && (
        <GithubHeatmap contributions={githubContributions} />
      )}
      
      {user && <Github_activity user={user} />}
      
      {user?.leetcode && (
        <LeetCodeHeatmap username={user.leetcode} />
      )}
    </>
  );
}