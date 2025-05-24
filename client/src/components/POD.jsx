
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, Calendar } from "lucide-react";

// Skeleton loading component
function PODSkeleton() {
    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-4">
                <div className="h-6 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            {/* Subtitle */}
            <div className="h-3 bg-gray-200 rounded w-40 mb-4"></div>

            {/* Problem info section */}
            <div className="py-2 my-2 sm:my-3">
                {/* Problem number, difficulty, accuracy */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>

                {/* Problem title */}
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>

                {/* Topic tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="h-6 bg-gray-200 rounded w-16"></div>
                    ))}
                </div>
            </div>

            {/* Button */}
            <div className="mt-4">
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
}

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

    // Handle loading state with skeleton
    if (loading) {
        return <PODSkeleton />;
    }

    // Handle error state
    if (error) {
        return (
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-red-50 rounded-full p-4 mb-4">
                        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Error Loading Challenge</h3>
                    <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
            </div>
        );
    }

    // Handle data not found
    if (!podData || !podData.data || !podData.data.activeDailyCodingChallengeQuestion) {
        return (
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-gray-50 rounded-full p-4 mb-4">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Challenge Available</h3>
                    <p className="text-sm text-gray-500 text-center">No challenge data available at the moment</p>
                </div>
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
        difficulty === 'Easy' ? 'text-green-600 bg-green-100 border-green-200' :
            difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100 border-yellow-200' :
                'text-red-600 bg-red-100 border-red-200';

    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">LeetCode Problem of the Day</h2>

                {/* Enhanced date with calendar icon */}
                <div className="flex items-center text-xs sm:text-sm" style={{ color: 'var(--second-text-color)' }}>
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            <span className="text-xs sm:text-sm" style={{ color: 'var(--second-text-color)' }}>
                Your Daily coding challenge
            </span>

            <div className="py-2 my-2 sm:my-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border">
                        #{questionFrontendId}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium border ${difficultyColor}`}>
                        {difficulty}
                    </span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                        Accuracy: <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 font-medium rounded-md border border-purple-200">
                            {acRate.toFixed(1)}%
                        </span>
                    </span>
                </div>

                <h3 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {topicTags.map((tag) => (
                        <span
                            key={tag.id}
                            className="text-gray-700 text-xs px-2 py-1 rounded-md border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-2 sm:mt-0">
                <a
                    href={`https://leetcode.com${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">
                    Solve Challenge
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1.5 sm:ml-2" />
                </a>
            </div>
        </div>
    );
};

export default POD;