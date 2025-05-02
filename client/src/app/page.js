"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import GithubHeatmap from "@/components/GithubHeatmap";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
export default function Home() {
  const { user ,  token } = useAuth();
  const [githubcontributions, setGithubContributions] = useState([]);
console.log(user);
  useEffect(() => { 
    const fetchData = async () => {
      try {
        if(!user?.github) return;
        const response = await axios.get(`https://github-contributions-api.deno.dev/${user.github}.json`);
        const data = response.data.contributions;
      
        console.log(data);
        setGithubContributions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <GithubHeatmap contributions={githubcontributions} />
  );
}
