// "use client";
// import { useState, useEffect } from "react";
// const POD = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [podData, setPodData] = useState(null);

//     useEffect(() => {
//         const fetchPodData = async () => {
//             try {
//                 const res = await fetch("/api/leetcode/POD", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                 });

//                 if (!res.ok) throw new Error("API request failed");

//                 const data = await res.json();
//                 setPodData(data);
//                 console.log("POD data:", data);
//             } catch (error) {
//                 console.error("Failed to fetch POD data:", error);
//                 setError(error.message || "Unknown error");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPodData();
//     }, []);
//     return (
//         <div className="p-4 rounded-2xl bg-white shadow-md">
//             <h2>Pod is comming soon </h2>
//         </div>
//     );
// }

// export default POD;


"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const POD = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [podData, setPodData] = useState(null);
    const requestInProgress = useRef(false);

    useEffect(() => {
        // Create an AbortController to cancel requests if needed
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchPodData = async () => {
            // Prevent duplicate requests
            if (requestInProgress.current) return;
            requestInProgress.current = true;

            try {
                const res = await fetch("/api/leetcode/POD", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal,
                });

                if (!res.ok) throw new Error("API request failed");
                // it is not important for the problem to be inserted at that time okay 
                const data = await res.json();
                setPodData(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Failed to fetch POD data:", error);
                    setError(error.message || "Unknown error");
                }
            } finally {
                setLoading(false);
                requestInProgress.current = false;
            }
        };

        fetchPodData();

        return () => {
            controller.abort();
            requestInProgress.current = false;
        };
    }, []);

    // Handle loading state
    if (loading) {
        return (
            <div className="p-6 rounded-2xl bg-white shadow-md">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-white shadow-md">
                <h2 className="text-xl font-semibold text-red-500">Error loading today's challenge</h2>
                <p className="mt-2 text-gray-600">{error}</p>
            </div>
        );
    }

    // Handle data not found
    if (!podData || !podData.data || !podData.data.activeDailyCodingChallengeQuestion) {
        return (
            <div className="p-6 rounded-2xl bg-white shadow-md">
                <h2 className="text-xl font-semibold">Problem of the Day</h2>
                <p className="mt-2 text-gray-600">No challenge data available</p>
            </div>
        );
    }

    const { date, link, question } = podData.data.activeDailyCodingChallengeQuestion;
    const {
        acRate,
        difficulty,
        questionFrontendId,
        title,
        topicTags,
        hasVideoSolution,
        hasSolution
    } = question;

    // Format date: "2025-05-05" -> "May 5, 2025"
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get difficulty color
    const difficultyColor =
        difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
            difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                'text-red-600 bg-red-100';

    return (
        <div className="p-6 rounded-2xl bg-white shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">LeetCode Problem of the Day</h2>
                <span className="text-gray-500">{formattedDate}</span>
            </div>

            <div className="border-t border-b py-4 my-4">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-mono text-gray-600">#{questionFrontendId}</span>
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${difficultyColor}`}>
                        {difficulty}
                    </span>
                    <span className="text-gray-600 text-sm">
                        Accuracy: {acRate.toFixed(1)}%
                    </span>
                </div>

                <h3 className="text-lg font-semibold mb-3">{title}</h3>

                <div className="flex flex-wrap gap-2 mt-3">
                    {topicTags.map((tag) => (
                        <span
                            key={tag.id}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                <a
                    href={`https://leetcode.com${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Solve Challenge
                </a>

                {hasSolution && (
                    <a
                        href={`https://leetcode.com${link}solution/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        View Solution
                    </a>
                )}

                {hasVideoSolution && (
                    <span className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Video Solution Available
                    </span>
                )}
            </div>
        </div>
    );
};

export default POD;