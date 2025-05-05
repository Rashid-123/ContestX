"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

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

    const handleSubmit = async (platform) => {
        const input = platform === 'github' ? githubInput : leetcodeInput;
        const username = extractUsername(input, platform);

        try {
            // Set loading state
            setIsLoading(prev => ({ ...prev, [platform]: true }));

            const response = await axios.put(`http://localhost:5000/api/integrate/${platform}`,
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
        <div className="max-w-xl mx-auto p-6 space-y-10">
            <h1 className="text-2xl font-bold">Integrate Developer Profiles</h1>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">LeetCode</h2>
                <div className="flex flex-col">
                    <input
                        type="text"
                        className={`w-full p-2 border rounded ${!isEditingLeetcode ? 'bg-gray-100' : 'bg-white'}`}
                        placeholder="Enter LeetCode username or URL"
                        value={leetcodeInput}
                        onChange={handleInputChange(setLeetcodeInput)}
                        readOnly={!isEditingLeetcode}
                        disabled={isLoading.leetcode}
                    />
                    {leetcodeInput && (
                        <a
                            href={getProfileUrl("leetcode", leetcodeInput)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 underline text-sm mt-1"
                        >
                            View Profile on LeetCode
                        </a>
                    )}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => toggleEditMode("leetcode")}
                        className={`px-4 py-2 ${isEditingLeetcode ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded`}
                        disabled={isLoading.leetcode}
                    >
                        {isLoading.leetcode ? 'Processing...' : isEditingLeetcode ? 'Save' : originalValues.leetcode ? 'Update' : 'Connect'}
                    </button>
                    {isEditingLeetcode && (
                        <button
                            onClick={() => cancelEdit("leetcode")}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            disabled={isLoading.leetcode}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
