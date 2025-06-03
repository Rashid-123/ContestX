
"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CreateRecommendation from "@/components/CreateRecommendation";
import Nologin from "@/components/Nologin";
import Nolinked from "@/components/Nolinked";
import RecommendationList from "@/components/RecommendationList"; // Import the simplified component
import RecommendationListSkeleton from "@/components/RecommendationListSkeleton";
export default function Recommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [recommendation_Loading, setRecommendation_Loading] = useState(false);
  const { user, token, loading: authLoading } = useAuth();

  console.log("token in recommendation", token);
  console.log("authLoading in recommendation", authLoading);

  const fetchRecommendations = async () => {
    setRecommendation_Loading(true);
    if (!authLoading && token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommend/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        setRecommendations(data.recommendations);
        setRecommendation_Loading(false);
      } catch (err) {
        setFetchError(err.message);
      }
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchRecommendations();
    } else if (!authLoading && !user) {
      // If auth is done loading and no user, clear recommendations as they shouldn't be shown
      setRecommendations([]);
    }
  }, [user, token, authLoading]);

  // Global authentication loading state
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  // Error handling for the recommendations fetch
  if (fetchError) {
    const handleRetry = () => {
      setFetchError(null);
      fetchRecommendations();
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p>Error: {fetchError}</p>
        <button
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={handleRetry}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="  container mx-auto px-4 py-8">
      <div className="max-w-[1300px] mx-auto flext flex-col  item-center">
        <div>
          <header className="mb-8">
            <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              <Lightbulb className="h-6 w-6 mr-2" />
              My Recommendations
            </h2>
            {user && (
              <p className="text-gray-600 font-semibold ml-2">
                {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""} available
              </p>
            )}
          </header>
          <div>
            {user ? (
              recommendation_Loading ? (
                <RecommendationListSkeleton />
              ) : (
                <RecommendationList recommendations={recommendations} />
              )
            ) : (
              <div className="min-h-[350px] flex items-center justify-center" > <Nologin message="Please login to get your previous recommendations" /> </div>
            )}
          </div>


        </div>

        <div className="h-0.5 bg-gray-300 mx-auto rounded-full m-10"></div>
        <div className="flex flex-col items-center justify-center ">
          <h2 className="flex items-center text-2xl sm:text-3xl font-semibold text-purple-600 mb-5">
            <Lightbulb className="h-8 w-8 md:h-10 md:w-10 md:p-2 mr-3 p-1 text-purple-500 border border-purple-200 rounded rounded-md bg-purple-50" />
            Create Recommendation
          </h2>
          <div className="max-w-[900px] flex flex-col items-center justify-center min-h-[300px] min-w-[320px] md:min-w-[500px] lg:min-w-[700px]  md:p-10 sm:p-6 bg-purple-50 rounded rounded-lg border md:border-2 border-dashed border-purple-300">

            {user ? (
              user.leetcode ? (
                <CreateRecommendation username={user.leetcode} onCreated={fetchRecommendations} />
              ) : <div className="min-h-[350px] flex items-center justify-center" > <Nolinked message={"Please add your LeetCode to create recommendations"} /> </div>) : (
              <div className="min-h-[350px] flex items-center justify-center"> <Nologin message="Please login to create recommendations" /> </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}



