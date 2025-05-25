"use client";

import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RecommendationCard from "@/components/RecommendationCard";
import Nologin from "@/components/Nologin";
import Nolinked from "@/components/Nolinked";

// Skeleton component for loading state
const RecommendationSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </div>
);

export default function RecommendationsList() {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, token, loading: authLoading } = useAuth();

    const fetchRecommendations = async () => {
        try {
            if (token) {
                const response = await fetch("http://localhost:5000/api/recommend/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch recommendations");
                }
                const data = await response.json();
                setRecommendations(data.recommendations || []);
            }
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    // Refresh recommendations function to be called from parent
    const refreshRecommendations = () => {
        setIsLoading(true);
        setError(null);
        fetchRecommendations();
    };

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) return;

        if (user && token) {
            fetchRecommendations();
        } else {
            setIsLoading(false);
        }
    }, [user, token, authLoading]);

    // Show skeleton when auth is loading or recommendations are loading
    if (authLoading || isLoading) {
        return (
            <div>
                <header className="mb-8">
                    <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
                        <Lightbulb className="h-6 w-6 mr-2" />
                        My Recommendations
                    </h2>
                    <div className="h-4 bg-gray-200 rounded w-48 ml-2 animate-pulse"></div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <RecommendationSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        const handleRetry = () => {
            setIsLoading(true);
            setError(null);
            fetchRecommendations();
        };

        return (
            <div>
                <header className="mb-8">
                    <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
                        <Lightbulb className="h-6 w-6 mr-2" />
                        My Recommendations
                    </h2>
                </header>
                <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
                    <p>Error: {error}</p>
                    <button
                        className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={handleRetry}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Show no login state
    if (!user) {
        return (
            <div>
                <header className="mb-8">
                    <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
                        <Lightbulb className="h-6 w-6 mr-2" />
                        My Recommendations
                    </h2>
                </header>
                <Nologin message="Please login to view your recommendations" />
            </div>
        );
    }

    // Show no linked account state
    if (!user.leetcode) {
        return (
            <div>
                <header className="mb-8">
                    <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
                        <Lightbulb className="h-6 w-6 mr-2" />
                        My Recommendations
                    </h2>
                </header>
                <Nolinked message="Please link your LeetCode account to view recommendations" />
            </div>
        );
    }

    // Show recommendations or empty state
    return (
        <div>
            <header className="mb-8">
                <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-2">
                    <Lightbulb className="h-6 w-6 mr-2" />
                    My Recommendations
                </h2>
                <p className="text-gray-500 font-semibold ml-2">
                    {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""} available
                </p>
            </header>

            {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((recommendation) => (
                        <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] rounded-lg p-8">
                    <p className="text-gray-500 mb-4">No recommendations found</p>
                    <p className="text-gray-400 text-center">
                        Seems like you have no recommendations yet. Create your first one below!
                    </p>
                </div>
            )}
        </div>
    );

    // Expose refresh function for parent component
    RecommendationsList.refresh = refreshRecommendations;
}