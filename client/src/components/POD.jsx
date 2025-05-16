


"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-md">
                <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold text-red-500">Error loading today's challenge</h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600">{error}</p>
            </div>
        );
    }

    // Handle data not found
    if (!podData || !podData.data || !podData.data.activeDailyCodingChallengeQuestion) {
        return (
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white shadow-md">
                <h2 className="text-lg sm:text-xl font-semibold">Problem of the Day</h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600">No challenge data available</p>
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
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold">LeetCode Problem of the Day</h2>
                <span className=" text-xs sm:text-sm" style={{ color: 'var(--second-text-color)' }}>{formattedDate}</span>
            </div>

            <span className=" text-xs sm:text-sm" style={{ color: 'var(--second-text-color)' }}>Your Daily coding challenge</span>

            <div className="py-2 my-2 sm:my-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-600">#{questionFrontendId}</span>
                    <span className={`px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium ${difficultyColor}`}>
                        {difficulty}
                    </span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                        Accuracy: <span className="p-0.5 bg-purple-300 font-medium rounded-md">{acRate.toFixed(1)}%</span>
                    </span>
                </div>

                <h3 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3">{title}</h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    {topicTags.map((tag) => (
                        <span
                            key={tag.id}
                            className="text-gray-800 text-xs px-1.5 sm:px-2 py-0.5 rounded-md border border-gray-200"
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
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                    Solve Challenge
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1.5 sm:ml-2" />
                </a>
            </div>
        </div>
    );
};

export default POD;