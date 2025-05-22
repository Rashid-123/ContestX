'use client';

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
export default function RecommendationDetails() {
    const { token } = useAuth();
    const { id } = useParams();
    const [recommendation, setRecommendation] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    setRecommendation(data.recommendation.recommendations);
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

    if (loading) return <div className="text-center mt-12">Loading...</div>;

    if (!recommendation) return <div className="text-center mt-12">Recommendation not found.</div>;

    return (
        <div className="max-w-2xl mx-auto mt-12 bg-white shadow rounded p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{recommendation.name}</h1>
            <p className="text-gray-600 mb-2">Created: {new Date(recommendation.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700">Total Problems: {recommendation.length}</p>

            {recommendation.map((rec) => (
                <div >
                    <h2>{rec.recommendedProblemNumber}</h2>
                    <h5>{rec.title}</h5>
                    <p>{rec.difficulty}</p>
                    <a
                        href={`https://leetcode.com/problems/${rec.titleSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Open problem in LeetCode"
                    >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hover:text-gray-800" />
                    </a>
                </div>

            ))}



        </div>
    );
}
