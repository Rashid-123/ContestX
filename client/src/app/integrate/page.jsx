"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Axis3D } from "lucide-react";
import axios from "axios";

export default function Integrate() {
    const { user, token } = useAuth();
    const [githubInput, setGithubInput] = useState("");
    const [leetcodeInput, setLeetcodeInput] = useState("");

    useEffect(() => {
        if (user) {
            if (user.github) setGithubInput(user.github);
            if (user.leetCode) setLeetcodeInput(user.leetCode);
        }
    }, [user]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const extractUsername = (input, platfrom) => {
        try {
            const url = new URL(input);

            if (platfrom === 'github' && url.hostname.includes("github.com")) {
                return url.pathname.split("/")[1];
            }
            console.log(url.hostname, url.pathname)
            " this is the response of above console.lgo , leetcode.com /u/rashid_01/"

            if (platfrom === "leetcode" && url.hostname.includes("leetcode.com")) {
                console.log("inside the if statement")
                const parts = url.pathname.split("/").filter(Boolean);
                console.log(parts)
                if (parts[0] === "u" && parts[1]) {
                    return parts[1];
                }
            }
            console.log(input, platfrom)
            return input;
        } catch (error) {
            return input;
        }
    }
    const handleSubmit = async (platfrom) => {

        const input = platfrom === 'github' ? githubInput : leetcodeInput;
        const username = extractUsername(input, platfrom);

        try {

            const response = await axios.put(`http://localhost:5000/api/integrate/${platfrom}`,
                { username },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            console.log(`Successfully integrated ${platfrom}:`, response.data);
            alert(`${platfrom} username updated : ${username}`)
        } catch (error) {
            console.error(`Error integrating ${platfrom}:`, error);
        }
    }


    const getProfileUrl = (platfrom, input) => {
        const username = extractUsername(input, platfrom);
        if (!username) return null;

        return platfrom === "github" ? `https://github.com/${username}` : `https://leetcode.com/u/${username}`;
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-10">
            <h1 className="text-2xl font-bold">Integrate Developer Profiles</h1>

            {/* GitHub Integration Form */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">GitHub</h2>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter GitHub username or URL"
                    value={githubInput}
                    onChange={handleInputChange(setGithubInput)}
                />
                {githubInput && (
                    <a
                        href={getProfileUrl("github", githubInput)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                    >
                        View Profile on GitHub
                    </a>
                )}
                <button
                    onClick={() => handleSubmit("github")}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    Connect GitHub
                </button>
            </div>

            {/* LeetCode Integration Form */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">LeetCode</h2>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter LeetCode username or URL"
                    value={leetcodeInput}
                    onChange={handleInputChange(setLeetcodeInput)}
                />
                {leetcodeInput && (
                    <a
                        href={getProfileUrl("leetcode", leetcodeInput)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 underline text-sm"
                    >
                        View Profile on LeetCode
                    </a>
                )}
                <button
                    onClick={() => handleSubmit("leetcode")}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                    Connect LeetCode
                </button>
            </div>
        </div>
    );
}