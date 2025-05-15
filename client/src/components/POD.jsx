


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
        <div className="p-6 rounded-2xl bg-white border border-gray-200 ">
            <div className="flex justify-between items-center ">
                <h2 className="text-xl font-semibold">LeetCode Problem of the Day</h2>
                <span className="text-gray-500">{formattedDate}</span>

            </div>
            <span className="text-gray-500 text-sm">Your Daily coding challenge</span>
            <div className=" py-2 my-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-mono text-gray-600">#{questionFrontendId}</span>
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${difficultyColor}`}>
                        {difficulty}
                    </span>
                    <span className="text-gray-600 text-sm">
                        Accuracy : <span className="p-0.5 bg-purple-300 font-medium rounded-md">{acRate.toFixed(1)}%</span>
                    </span>
                </div>

                <h3 className="text-md  font-semibold mb-3">{title}</h3>

                <div className="flex flex-wrap gap-2 mt-3">
                    {topicTags.map((tag) => (
                        <span
                            key={tag.id}
                            className=" text-gray-800 text-xs px-2 py-0.5 rounded-md border border-gray-200"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div >
                <a
                    href={`https://leetcode.com${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" px-4 py-2 rounded-md text-sm font-medium full-width flex items-center justify-center border border-blue-200 "
                >
                    Solve Challenge
                </a>
            </div>
        </div>
    );
};

export default POD;