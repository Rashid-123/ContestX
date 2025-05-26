
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { SiLeetcode } from "react-icons/si";
import { Settings } from "lucide-react";
import Nologin from "@/components/Nologin";

export default function Integrate() {
    const { user, setUser, token, loading } = useAuth();
    const [leetcodeInput, setLeetcodeInput] = useState("");
    const [isEditingLeetcode, setIsEditingLeetcode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [originalValue, setOriginalValue] = useState("");

    useEffect(() => {
        if (user && user.leetcode) {
            setLeetcodeInput(user.leetcode);
            setOriginalValue(user.leetcode);
        }
    }, [user]);

    const handleInputChange = (e) => {
        setLeetcodeInput(e.target.value);
    };

    const extractUsername = (input) => {
        try {
            const url = new URL(input);

            if (url.hostname.includes("leetcode.com")) {
                const parts = url.pathname.split("/").filter(Boolean);
                if (parts[0] === "u" && parts[1]) {
                    return parts[1];
                }
            }
            return input;
        } catch (error) {
            return input;
        }
    };

    const toggleEditMode = () => {
        if (isEditingLeetcode) {
            // Save changes
            handleSubmit();
        } else {
            // Enter edit mode
            setIsEditingLeetcode(true);
        }
    };

    const cancelEdit = () => {
        setLeetcodeInput(originalValue);
        setIsEditingLeetcode(false);
    };

    const handleSubmit = async () => {
        const username = extractUsername(leetcodeInput);

        try {
            // Set loading state
            setIsLoading(true);

            const response = await axios.put(`http://localhost:5000/api/integrate/leetcode`,
                { username },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

            // Update user data
            setUser(response.data.user);

            // Update original value
            setOriginalValue(username);

            // Exit edit mode
            setIsEditingLeetcode(false);

            alert(`LeetCode username updated: ${username}`);

        } catch (error) {
            console.error(`Error integrating LeetCode:`, error);
            alert(`Failed to update LeetCode username. Please try again.`);
        } finally {
            // Clear loading state
            setIsLoading(false);
        }
    };

    const getProfileUrl = (input) => {
        const username = extractUsername(input);
        if (!username) return null;
        return `https://leetcode.com/u/${username}`;
    };

    return (
        <div className="container mx-auto px-6 py-8 flex flex-col gap-4 max-w-[900px]">
            <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-4">
                <Settings className="h-6 w-6 mr-2" />
                Integrate
            </h2>

            <div className="bg-white p-5 sm:p-6 md:p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-sm">
                <div className="flex items-center mb-3">
                    <SiLeetcode className="w-5 h-5 mr-2 text-yellow-500" />
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        LeetCode Integration
                    </h2>
                </div>


                {loading ? <Skeleton /> : (!user ? (
                    <Nologin message={"Please login to integrate your LeetCode"} />
                ) : (
                    <div>
                        <div>
                            <p className="text-sm sm:text-base" style={{ color: 'var(--second-text-color)' }}>
                                Integrate your LeetCode username to unlock smarter suggestions tailored to your recent activity.
                            </p>
                            <p className="text-sm sm:text-base" style={{ color: 'var(--second-text-color)' }}>
                                We analyze your solved problems and recommend the next best challenges to level up your skills.
                            </p>
                        </div>

                        <div className="flex flex-col my-7">
                            <label htmlFor="leetcode-username" className="text-sm font-semibold mb-2 text-gray-1000">
                                LeetCode Username
                            </label>
                            <div className="relative">
                                <input
                                    id="leetcode-username"
                                    type="text"
                                    className={`w-full p-2 text-sm placeholder:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${!isEditingLeetcode ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    placeholder="Enter LeetCode username or URL"
                                    value={leetcodeInput}
                                    onChange={handleInputChange}
                                    readOnly={!isEditingLeetcode}
                                    disabled={isLoading}
                                />
                                {isLoading && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            <span className="text-sm mt-1" style={{ color: 'var(--second-text-color)' }}>
                                Example: "username" or "https://leetcode.com/u/username"
                            </span>

                            {leetcodeInput && (
                                <a
                                    href={getProfileUrl(leetcodeInput)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 underline text-sm mt-2 inline-flex items-center"
                                >
                                    View Profile on LeetCode
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={toggleEditMode}
                                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEditingLeetcode
                                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
                                    : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
                                    } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : isEditingLeetcode ? 'Save' : originalValue ? 'Update' : 'Connect'}
                            </button>

                            {isEditingLeetcode && (
                                <button
                                    onClick={cancelEdit}
                                    className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}



function Skeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="flex gap-3 mt-4">
                <div className="h-8 w-20 bg-blue-200 rounded-lg"></div>
                <div className="h-8 w-20 bg-red-200 rounded-lg"></div>
            </div>
        </div>
    );
}