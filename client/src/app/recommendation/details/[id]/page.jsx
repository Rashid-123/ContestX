'use client';

import React, { useEffect, useState } from "react";
import { ExternalLink, MessageSquare, X } from "lucide-react";
import { useParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function RecommendationDetails() {
    const { token } = useAuth();
    const { id } = useParams();
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isSlideOpen, setIsSlideOpen] = useState(false);

    useEffect(() => {
        const fetchRecommendation = async () => {
            if (!token || !id) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommend/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    setRecommendation(data.recommendation);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Failed to fetch recommendation", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [token, id]);

    const openMessage = (message) => {
        setSelectedMessage(message);
        setIsSlideOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeSlide = () => {
        setIsSlideOpen(false);
        document.body.style.overflow = 'unset';
        setTimeout(() => setSelectedMessage(null), 300);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "Easy": return "text-green-600 bg-green-50 border-green-200";
            case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Hard": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    // --- Skeleton Component ---
    const RecommendationDetailsSkeleton = () => (
        <div className="min-h-screen py-6 mt-8 animate-pulse">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 mb-6 shadow-xs">
                    <div className="h-7 bg-blue-100 rounded w-3/4 mb-4"></div> {/* Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-blue-100 rounded w-18"></div>
                            <div className="h-6 bg-gray-100 rounded-lg w-16"></div>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-auto">
                            <div className="h-4 w-4 bg-gray-100 rounded"></div>
                            <div className="h-4 bg-gray-100 rounded w-20"></div>
                            <div className="h-4 bg-gray-100 rounded w-24"></div>
                        </div>
                    </div>
                </div>

                {/* Problems List Skeleton (e.g., 3 items) */}
                <div className="space-y-3">
                    {[...Array(3)].map((_, index) => ( // Render 3 skeleton items
                        <div key={index} className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-xs">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-5 bg-red-100 rounded border w-16"></div>
                                        <div className="h-6 bg-gray-200 rounded w-64"></div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    <div className="h-8 bg-yellow-100 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    // --- End Skeleton Component ---


    if (loading) {
        return <RecommendationDetailsSkeleton />; // Render the skeleton when loading
    }

    if (!recommendation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Recommendation not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">


                {/* Header Section */}
                <div className="border-b border-blue-200 p-4 sm:p-6 mb-4 sm:mb-6 transition-shadow">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 tracking-tight leading-tight">
                        {recommendation.name}
                    </h1>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 text-sm text-gray-700">
                        {/* Problems Count with Badge Style */}
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600 text-xs sm:text-sm">Total Problems:</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {recommendation.recommendations.length}
                            </span>
                        </div>

                        {/* Date with Calendar Icon and Better Formatting */}
                        <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-gray-600 text-xs sm:text-sm whitespace-nowrap">Created:</span>
                            <span className="font-medium text-gray-800 text-xs sm:text-sm">
                                {new Date(recommendation.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                </div>


                <div className="space-y-3">
                    {recommendation.recommendations.map((rec, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 shadow-xs">
                            {/* Problem Header */}
                            <div className="flex items-start justify-between gap-3 mb-5">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-sm sm:text-base font-medium md:font-semibold text-gray-800 leading-tight">
                                        <span className="text-gray-600">{rec.recommendedProblemNumber} - </span>
                                        <span className="break-words">{rec.title}</span>
                                    </h2>
                                </div>
                                <span
                                    className={`px-2 py-0.5 text-xs font-medium rounded border whitespace-nowrap ${getDifficultyColor(
                                        rec.difficulty
                                    )}`}
                                >
                                    {rec.difficulty}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                                <button
                                    onClick={() => openMessage(rec.message)}
                                    className="flex items-center justify-center xs:justify-start space-x-2 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors flex-1 xs:flex-none"
                                >
                                    <MessageSquare className="h-3 w-3" />
                                    <span>View Hint</span>
                                </button>
                                <a
                                    href={`https://leetcode.com/problems/${rec.titleSlug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center xs:justify-start space-x-2 px-3 py-2 text-xs font-medium text-gray-600 bg-yellow-100 border border-yellow-200 rounded hover:bg-yellow-200 transition-colors flex-1 xs:flex-none"
                                    aria-label="Open problem in LeetCode"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>Open in LeetCode</span>
                                </a>
                            </div>
                        </div>




                    ))}
                </div>
            </div >

            {/* Slide Panel (Remains unchanged as it's not part of initial load) */}
            < div className={`fixed inset-0 z-50 ${isSlideOpen ? 'pointer-events-auto' : 'pointer-events-none'}`
            }>
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${isSlideOpen ? 'opacity-50' : 'opacity-0'
                        }`}
                    onClick={closeSlide}
                />
                <div className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSlideOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">
                                Problem Recommendation
                            </h3>
                            <button
                                onClick={closeSlide}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5">
                            {selectedMessage && (
                                <div dangerouslySetInnerHTML={{ __html: selectedMessage }} />
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}


