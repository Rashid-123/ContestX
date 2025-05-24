


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
                const res = await fetch(`http://localhost:5000/api/recommend/${id}`, {
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
        // Prevent body scroll when slide is open
        document.body.style.overflow = 'hidden';
    };

    const closeSlide = () => {
        setIsSlideOpen(false);
        // Restore body scroll
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!recommendation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Recommendation not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-6 mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="bg-purple-50 border border-blue-100 rounded-xl p-6 mb-6 shadow-xs  transition-shadow">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4 tracking-tight">
                        {recommendation.name}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700 gap-4">
                        {/* Problems Count with Badge Style */}
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600">Total Problems:</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {recommendation.recommendations.length}
                            </span>
                        </div>

                        {/* Date with Calendar Icon and Better Formatting */}
                        <div className="flex items-center gap-2 sm:ml-auto">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-gray-600">Created:</span>
                            <span className="font-medium text-gray-800">
                                {new Date(recommendation.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Problems List */}
                <div className="space-y-3">
                    {recommendation.recommendations.map((rec, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                {/* Problem Info */}
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`px-2 py-0.5 text-xs font-medium rounded border ${getDifficultyColor(
                                                rec.difficulty
                                            )}`}
                                        >
                                            {rec.difficulty}
                                        </span>
                                        <span className="text-base font-bold text-gray-900">
                                            <h2 className="text-base font-semibold text-gray-800">
                                                <span className="text-gray-600">{rec.recommendedProblemNumber} - </span>
                                                {rec.title}
                                            </h2>
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                                    <button
                                        onClick={() => openMessage(rec.message)}
                                        className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                                    >
                                        <MessageSquare className="h-3 w-3" />
                                        <span>Message</span>
                                    </button>
                                    <a
                                        href={`https://leetcode.com/problems/${rec.titleSlug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-yellow-100 border border-yellow-300 rounded hover:bg-yellow-200 transition-colors"
                                        aria-label="Open problem in LeetCode"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        <span>LeetCode</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide Panel */}
            <div className={`fixed inset-0 z-50 ${isSlideOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${isSlideOpen ? 'opacity-50' : 'opacity-0'
                        }`}
                    onClick={closeSlide}
                />

                {/* Slide Panel */}
                <div className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSlideOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
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

                        {/* Content - Now much simpler! */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {selectedMessage && (
                                <div dangerouslySetInnerHTML={{ __html: selectedMessage }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}