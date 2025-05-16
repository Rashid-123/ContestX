"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { SiLeetcode } from "react-icons/si";
export default function Integrate() {
    const { user, setUser, token } = useAuth();
    const [githubInput, setGithubInput] = useState("");
    const [leetcodeInput, setLeetcodeInput] = useState("");
    const [isEditingGithub, setIsEditingGithub] = useState(false);
    const [isEditingLeetcode, setIsEditingLeetcode] = useState(false);
    const [isLoading, setIsLoading] = useState({ github: false, leetcode: false });
    const [originalValues, setOriginalValues] = useState({ github: "", leetcode: "" });

    useEffect(() => {
        if (user) {
            if (user.github) {
                setGithubInput(user.github);
                setOriginalValues(prev => ({ ...prev, github: user.github }));
            }
            if (user.leetcode) {
                setLeetcodeInput(user.leetcode);
                setOriginalValues(prev => ({ ...prev, leetcode: user.leetcode }));
            }
        }
    }, [user]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const extractUsername = (input, platform) => {
        try {
            const url = new URL(input);

            if (platform === 'github' && url.hostname.includes("github.com")) {
                return url.pathname.split("/")[1];
            }

            if (platform === "leetcode" && url.hostname.includes("leetcode.com")) {
                const parts = url.pathname.split("/").filter(Boolean);
                if (parts[0] === "u" && parts[1]) {
                    return parts[1];
                }
            }
            return input;
        } catch (error) {
            return input;
        }
    }

    const toggleEditMode = (platform) => {
        if (platform === 'github') {
            if (isEditingGithub) {
                // Save changes
                handleSubmit('github');
            } else {
                // Enter edit mode
                setIsEditingGithub(true);
            }
        } else if (platform === 'leetcode') {
            if (isEditingLeetcode) {
                // Save changes
                handleSubmit('leetcode');
            } else {
                // Enter edit mode
                setIsEditingLeetcode(true);
            }
        }
    };

    const cancelEdit = (platform) => {
        if (platform === 'github') {
            setGithubInput(originalValues.github);
            setIsEditingGithub(false);
        } else if (platform === 'leetcode') {
            setLeetcodeInput(originalValues.leetcode);
            setIsEditingLeetcode(false);
        }
    };

    const handleSubmit = async () => {
        const input = platform === 'github' ? githubInput : leetcodeInput;
        const username = extractUsername(input);

        try {
            // Set loading state
            setIsLoading(prev => ({ ...prev, [platform]: true }));

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

            // Update original values
            setOriginalValues(prev => ({ ...prev, [platform]: username }));

            // Exit edit mode
            if (platform === 'github') {
                setIsEditingGithub(false);
            } else if (platform === 'leetcode') {
                setIsEditingLeetcode(false);
            }

            alert(`${platform} username updated: ${username}`);

        } catch (error) {
            console.error(`Error integrating ${platform}:`, error);
            alert(`Failed to update ${platform} username. Please try again.`);
        } finally {
            // Clear loading state
            setIsLoading(prev => ({ ...prev, [platform]: false }));
        }
    }

    const getProfileUrl = (platform, input) => {
        const username = extractUsername(input, platform);
        if (!username) return null;

        return platform === "github" ? `https://github.com/${username}` : `https://leetcode.com/u/${username}`;
    };


    return (
        <div className="container mx-auto px-4 py-8 flex flex-col gap-4  max-w-[1080px]">
            <div className=" p-5 sm:p-6 md:p-8 rounded-2xl border border-gray-200  transition-all duration-300 hover:shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 flex items-center">
                    <SiLeetcode className="w-5 h-5 mr-2" />
                    LeetCode Integration
                </h2>


                <div className="space-y-2 mb-6">
                    <p className=" text-sm sm:text-base" style={{ color: 'var(--second-text-color)' }}>
                        Integrate your LeetCode username to unlock smarter suggestions tailored to your recent activity.
                    </p>
                    <p className=" text-sm sm:text-base" style={{ color: 'var(--second-text-color)' }}>
                        We analyze your solved problems and recommend the next best challenges to level up your skills.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="leetcode-username" className="text-sm font-semibold mb-2 text-gray-900">
                            LeetCode Username
                        </label>
                        <div className="relative">
                            <input
                                id="leetcode-username"
                                type="text"
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${!isEditingLeetcode ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                placeholder="Enter LeetCode username or URL"
                                value={leetcodeInput}
                                onChange={handleInputChange(setLeetcodeInput)}
                                readOnly={!isEditingLeetcode}
                                disabled={isLoading.leetcode}
                            />
                            {isLoading.leetcode && (
                                <div className="absolute right-3 top-3">
                                    <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <span>Example: "username" or "https://leetcode.com/username" </span>

                        {leetcodeInput && (
                            <a
                                href={getProfileUrl("leetcode", leetcodeInput)}
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
                            onClick={() => toggleEditMode("leetcode")}
                            className={`px-4 py-3 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${isEditingLeetcode
                                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                : 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400'
                                } ${isLoading.leetcode ? 'opacity-75 cursor-not-allowed' : ''}`}
                            disabled={isLoading.leetcode}
                        >
                            {isLoading.leetcode ? 'Processing...' : isEditingLeetcode ? 'Save' : originalValues.leetcode ? 'Update' : 'Connect'}
                        </button>

                        {isEditingLeetcode && (
                            <button
                                onClick={() => cancelEdit("leetcode")}
                                className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                disabled={isLoading.leetcode}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}


