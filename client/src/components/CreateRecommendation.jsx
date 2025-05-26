
"use client";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Lightbulb } from "lucide-react";
import { useLeetCode } from "@/context/LeetCodeContext";
import { useState, useEffect } from "react";
export default function CreateRecommendation({ username, onCreated }) {
    const [recommendationName, setRecommendationName] = useState("");
    const [numberOfProblems, setNumberOfProblems] = useState(5);
    const [Hard, setHard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previousProblems, setPreviousProblems] = useState([]);

    const { token } = useAuth();
    const { submissions, isLoading, leetCodeError, fetchLeetCodeData } = useLeetCode();

    useEffect(() => {
        console.log("Username effect triggered:", username);
        if (username) {
            console.log("Calling fetchLeetCodeData for:", username);
            fetchLeetCodeData(username);
        }
    }, [username, fetchLeetCodeData]);

    useEffect(() => {
        console.log("Submissions effect triggered:", submissions);
        if (submissions && submissions.length > 0) {
            const numbers = submissions.map((submission) => submission.number);
            setPreviousProblems(numbers);
            console.log("Set problem numbers:", numbers);
        } else {
            console.log("No submissions available or empty array");
            setPreviousProblems([]);
        }
    }, [submissions]);

    const createRecommendation = async (e) => {
        e.preventDefault();

        if (previousProblems.length === 0) {
            alert("No Previous problems available. Please wait for data to load or check your LeetCode username.");
            return;
        }

        const confirmed = window.confirm(
            "This will use your credits and cannot be undone. Continue?"
        );
        if (!confirmed) return;

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/recommend/",
                { problemNumbers: previousProblems, numRecommendations: numberOfProblems, Hard, name: recommendationName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Recommendation created:", response.data);
            if (onCreated) {
                onCreated();
            }
            setRecommendationName("");
            setHard(false);
        } catch (error) {
            console.error(
                "Error creating recommendation:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex flex-col bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center mb-4">
                    <Lightbulb className="h-6 w-6 text-blue-500" />
                    <h2 className="text-lg font-semibold ml-2">Create a Recommendation</h2>
                </div>
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading LeetCode data...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (leetCodeError) {
        return (
            <div className="flex flex-col bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center mb-4">
                    <Lightbulb className="h-6 w-6 text-blue-500" />
                    <h2 className="text-lg font-semibold ml-2">Create a Recommendation</h2>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-red-700">Error loading LeetCode data: {leetCodeError}</p>
                    <button
                        onClick={() => username && fetchLeetCodeData(username)}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white rounded-lg p-4 mb-4">


            <div className="mb-4">
                <span className={`text-sm ${previousProblems.length === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Number of problems : {previousProblems.length}
                </span>
                {previousProblems.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                        No problems loaded. Make sure your LeetCode username is correct.
                    </p>
                )}
            </div>

            <form className="space-y-4" onSubmit={createRecommendation}>
                <label
                    htmlFor="recommendationName"
                    className="block text-sm font-medium text-gray-700"
                >
                    Recommendation Name
                </label>
                <input
                    type="text"
                    id="recommendationName"
                    name="recommendationName"
                    placeholder="Recommendation Name"
                    value={recommendationName}
                    onChange={(e) => setRecommendationName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />

                <label htmlFor="numberOfProblems" className="block text-sm font-medium text-gray-700">
                    Number of Problems
                </label>
                <select
                    id="numberOfProblems"
                    name="numberOfProblems"
                    value={numberOfProblems}
                    onChange={(e) => setNumberOfProblems(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                </select>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="recommendationHard"
                        checked={Hard}
                        onChange={(e) => setHard(e.target.checked)}
                    />
                    <label htmlFor="recommendationHard" className="text-sm text-gray-700">
                        Include Hard Problems
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading || previousProblems.length === 0}
                    className={`w-full bg-blue-500 text-white p-2 rounded transition-colors ${loading || previousProblems.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                        }`}
                >
                    {loading ? "Creating..." : "Create Recommendation"}
                </button>
            </form>
        </div>
    );
}


