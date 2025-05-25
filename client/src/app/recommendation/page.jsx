
// "use client";

// import { useState, useEffect } from "react";
// import { Lightbulb, Loader2 } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import { useLeetCode } from "@/context/LeetCodeContext";
// import RecommendationCard from "@/components/RecommendationCard";
// import CreateRecommendation from "@/components/CreateRecommendation";
// import Nologin from "@/components/Nologin";
// import Nolinked from "@/components/Nolinked";
// export default function Recommendation() {
//   const [recommendations, setRecommendations] = useState([]);
//   const [isLoading, setisLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { user, token, loading } = useAuth();
//   console.log("token in recommendation", token);

//   const fetchRecommendations = async () => {
//     try {
//       if (token) {
//         const response = await fetch("http://localhost:5000/api/recommend/all", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           }
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch recommendations");
//         }
//         console.log("response", response);
//         const data = await response.json();
//         console.log("data", data);
//         setRecommendations(data.recommendations);
//       }
//       // Always set loading to false, regardless of token presence
//       setisLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setisLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchRecommendations();
//     } else {
//       setisLoading(false);
//     }
//   }, [user, token]);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//         <p className="mt-4 text-gray-500">Loading recommendations...</p>
//       </div>
//     );
//   }

//   if (error) {
//     const handleRetry = () => {
//       setisLoading(true);
//       setError(null);
//       fetchRecommendations();
//     };

//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
//         <p>Error: {error}</p>
//         <button
//           className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//           onClick={handleRetry}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div>
//         <header className="mb-8">
//           <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
//             <Lightbulb className="h-6 w-6 mr-2" />
//             My Recommendations
//           </h2>
//           {user && (
//             <p className="text-gray-500 font-semibold ml-2">
//               {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""} available
//             </p>
//           )}
//         </header>

//         {user ? (
//           recommendations.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {recommendations.map((recommendation) => (
//                 <RecommendationCard key={recommendation.id} recommendation={recommendation} />
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center min-h-[300px] rounded-lg p-8">
//               <p className="text-gray-500 mb-4">No recommendations found</p>
//               <p className="text-gray-400 text-center">
//                 Seems like you have no recommendations yet. Create your first one below!
//               </p>
//             </div>
//           )
//         ) : (
//           <Nologin message="Please login to get your previous recommendations" />
//         )}
//       </div>

//       <div className="h-0.5 bg-gray-300 mx-auto rounded-full m-10"></div>

//       <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-gray-300 rounded-lg p-8">
//         <div className="flex items-center mb-4">
//           <Lightbulb className="h-6 w-6 text-blue-500" />
//           <h2 className="text-lg font-semibold ml-2">Create a Recommendation</h2>
//         </div>



//         {user ? (
//           user.leetcode ? (
//             <CreateRecommendation username={user.leetcode} onCreated={fetchRecommendations} />
//           ) : <Nolinked message={"Plese add you leetcode to create recommendations"} />) : (
//           <Nologin message="Please login to create recommendations" />
//         )}

//       </div>
//     </div>
//   );
// }

"use client";

import { useRef } from "react";
import { Lightbulb, Info, Coins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RecommendationsList from "@/components/RecommendationList";
import CreateRecommendation from "@/components/CreateRecommendation";
import Nologin from "@/components/Nologin";
import Nolinked from "@/components/Nolinked";

export default function Recommendation() {
  const { user, loding } = useAuth();
  const recommendationsListRef = useRef(null);

  const handleRecommendationCreated = () => {
    // Refresh the recommendations list when a new one is created
    if (recommendationsListRef.current && recommendationsListRef.current.refresh) {
      recommendationsListRef.current.refresh();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Recommendations List Section */}
      <RecommendationsList ref={recommendationsListRef} />

      {/* Divider */}
      <div className="h-0.5 bg-gray-300 mx-auto rounded-full my-12"></div>

      {/* Create Recommendation Section */}
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl font-semibold ml-3 text-gray-800">Create a Recommendation</h2>
          </div>

          <p className="text-gray-600 mb-4 max-w-2xl">
            Get personalized problem recommendations based on your LeetCode submission history.
            Our algorithm analyzes your solved problems to suggest the most relevant challenges for your growth.
          </p>

          {/* Credit Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Coins className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Credit Information</span>
            </div>
            <p className="text-blue-700 text-sm">
              Each problem recommendation costs <strong>1 credit</strong>.
              Choose your recommendation size accordingly.
            </p>
          </div>
        </div>

        {/* Create Recommendation Component or Login/Link Messages */}
        {user ? (
          user.leetcode ? (
            <CreateRecommendation
              username={user.leetcode}
              onCreated={handleRecommendationCreated}
            />
          ) : (
            <div className="text-center">
              <Nolinked message="Please link your LeetCode account to create personalized recommendations" />
            </div>
          )
        ) : (
          <div className="text-center">
            <Nologin message="Please login to create personalized recommendations" />
          </div>
        )}
      </div>
    </div>
  );
}


