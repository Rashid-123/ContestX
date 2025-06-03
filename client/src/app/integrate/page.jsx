


// "use client";
// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";
// import { SiLeetcode } from "react-icons/si";
// import { Settings, Edit3, Save, X } from "lucide-react";
// import Nologin from "@/components/Nologin";

// export default function Integrate() {
//     const { user, setUser, token, loading } = useAuth();
//     const [leetcodeInput, setLeetcodeInput] = useState("");
//     const [isEditingLeetcode, setIsEditingLeetcode] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [originalValue, setOriginalValue] = useState("");
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [formatError, setFormatError] = useState("");
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

//     useEffect(() => {
//         if (user && user.leetcode) {
//             setLeetcodeInput(user.leetcode);
//             setOriginalValue(user.leetcode);
//         }
//     }, [user]);

//     // Check for unsaved changes
//     useEffect(() => {
//         if (isEditingLeetcode) {
//             const currentUsername = extractUsername(leetcodeInput);
//             const originalUsername = extractUsername(originalValue);
//             setHasUnsavedChanges(currentUsername !== originalUsername);
//         } else {
//             setHasUnsavedChanges(false);
//         }
//     }, [leetcodeInput, originalValue, isEditingLeetcode]);

//     // Frontend validation function
//     const isValidUsernameFormat = (username) => {
//         const usernameRegex = /^[a-zA-Z0-9_-]{1,15}$/;
//         return usernameRegex.test(username);
//     };

//     const handleInputChange = (e) => {
//         const value = e.target.value;
//         setLeetcodeInput(value);

//         // Clear previous errors when user starts typing
//         setError("");
//         setSuccess("");
//         setFormatError("");

//         // Real-time format validation only in edit mode
//         if (isEditingLeetcode && value.trim() !== "") {
//             const username = extractUsername(value);
//             if (!isValidUsernameFormat(username)) {
//                 setFormatError("Username should be 1-15 characters long and contain only letters, numbers, underscores, and hyphens.");
//             }
//         }
//     };

//     const extractUsername = (input) => {
//         try {
//             const url = new URL(input);

//             if (url.hostname.includes("leetcode.com")) {
//                 const parts = url.pathname.split("/").filter(Boolean);
//                 if (parts[0] === "u" && parts[1]) {
//                     return parts[1];
//                 }
//             }
//             return input;
//         } catch (error) {
//             return input;
//         }
//     };

//     const enterEditMode = () => {
//         setIsEditingLeetcode(true);
//         setError("");
//         setSuccess("");
//         setFormatError("");
//     };

//     const cancelEdit = () => {
//         setLeetcodeInput(originalValue);
//         setIsEditingLeetcode(false);
//         setError("");
//         setSuccess("");
//         setFormatError("");
//         setHasUnsavedChanges(false);
//     };

//     const handleSave = async () => {
//         const username = extractUsername(leetcodeInput);

//         // Clear previous messages
//         setError("");
//         setSuccess("");
//         setFormatError("");

//         // Frontend validation
//         if (!username || username.trim() === '') {
//             setError("LeetCode username is required.");
//             return;
//         }

//         if (!isValidUsernameFormat(username)) {
//             setFormatError("Invalid username format. Username should be 1-15 characters long and contain only letters, numbers, underscores, and hyphens.");
//             return;
//         }

//         try {
//             // Set loading state
//             setIsLoading(true);

//             const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/integrate/leetcode`,
//                 { username },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     }
//                 });

//             // Update user data
//             setUser(response.data.user);

//             // Update original value
//             setOriginalValue(username);

//             // Exit edit mode
//             setIsEditingLeetcode(false);
//             setHasUnsavedChanges(false);

//             // Show success message
//             setSuccess(`LeetCode username updated successfully: ${username}`);

//         } catch (error) {
//             console.error(`Error integrating LeetCode:`, error);

//             // Handle different types of errors
//             if (error.response?.data?.message) {
//                 setError(error.response.data.message);
//             } else if (error.response?.status === 400) {
//                 setError("Invalid LeetCode username or format.");
//             } else if (error.response?.status === 404) {
//                 setError("User not found.");
//             } else if (error.response?.status === 429) {
//                 setError("Too many requests. Please try again in a few minutes.");
//             } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
//                 setError("Unable to connect to server. Please check your internet connection.");
//             } else {
//                 setError("Failed to update LeetCode username. Please try again.");
//             }
//         } finally {
//             // Clear loading state
//             setIsLoading(false);
//         }
//     };

//     const getProfileUrl = (input) => {
//         const username = extractUsername(input);
//         if (!username) return null;
//         return `https://leetcode.com/u/${username}`;
//     };

//     return (
//         <div className="container mx-auto px-6 py-8 flex flex-col gap-4 max-w-[900px]">
//             <h2 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-700 mb-4">
//                 <Settings className="h-6 w-6 mr-2" />
//                 Integrate
//             </h2>

//             <div className="bg-white p-5 sm:p-6 md:p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-sm">
//                 <div className="flex items-center mb-3">
//                     <SiLeetcode className="w-5 h-5 mr-2 text-yellow-500" />
//                     <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//                         LeetCode Integration
//                     </h2>
//                 </div>

//                 {loading ? <Skeleton /> : (!user ? (
//                     <Nologin message={"Please login to integrate your LeetCode"} />
//                 ) : (
//                     <div>
//                         <div>
//                             <p className="text-sm sm:text-base" style={{ color: 'var(--second-text-color)' }}>
//                                 Integrate your LeetCode username to unlock smarter suggestions tailored to your recent activity.
//                             </p>
//                             <p className="text-sm sm:text-base" style={{ color: 'var(--second-text-color)' }}>
//                                 We analyze your solved problems and recommend the next best challenges to level up your skills.
//                             </p>
//                         </div>

//                         <div className="flex flex-col my-7">
//                             <div className="flex items-center justify-between mb-2">
//                                 <label htmlFor="leetcode-username" className="text-sm font-semibold text-gray-1000">
//                                     LeetCode Username
//                                 </label>
//                                 {isEditingLeetcode && (
//                                     <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
//                                         Editing Mode
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="relative">
//                                 <input
//                                     id="leetcode-username"
//                                     type="text"
//                                     className={`w-full p-2 text-sm placeholder:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${isEditingLeetcode
//                                         ? 'bg-white border-blue-300 focus:ring-blue-200'
//                                         : 'bg-gray-50 border-gray-300 focus:ring-gray-200'
//                                         } ${error || formatError ? 'border-red-500' : success ? 'border-green-500' : ''}`}
//                                     placeholder={isEditingLeetcode ? "Enter LeetCode username or URL" : "No username connected"}
//                                     value={leetcodeInput}
//                                     onChange={handleInputChange}
//                                     readOnly={!isEditingLeetcode}
//                                     disabled={isLoading}
//                                 />
//                                 {isLoading && (
//                                     <div className="absolute right-3 top-3">
//                                         <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
//                                     </div>
//                                 )}
//                             </div>
//                             <span className="text-sm mt-1" style={{ color: 'var(--second-text-color)' }}>
//                                 Example: "username" or "https://leetcode.com/u/username"
//                             </span>

//                             {/* Unsaved changes warning */}
//                             {hasUnsavedChanges && (
//                                 <div className="text-amber-600 text-sm mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
//                                     You have unsaved changes
//                                 </div>
//                             )}

//                             {/* Error Messages */}
//                             {formatError && (
//                                 <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
//                                     {formatError}
//                                 </div>
//                             )}
//                             {error && (
//                                 <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
//                                     {error}
//                                 </div>
//                             )}
//                             {success && (
//                                 <div className="text-green-600 text-sm mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
//                                     {success}
//                                 </div>
//                             )}

//                             {leetcodeInput && (
//                                 <a
//                                     href={getProfileUrl(leetcodeInput)}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 hover:text-blue-700 underline text-sm mt-2 inline-flex items-center"
//                                 >
//                                     View Profile on LeetCode
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                                     </svg>
//                                 </a>
//                             )}
//                         </div>

//                         <div className="flex flex-col sm:flex-row gap-3">
//                             {!isEditingLeetcode ? (
//                                 // View mode buttons

//                                 <button
//                                     onClick={enterEditMode}
//                                     className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center justify-center"
//                                     disabled={isLoading}
//                                 >
//                                     <Edit3 className="w-4 h-4 mr-2" />
//                                     {originalValue ? 'Edit Username' : 'Connect LeetCode'}
//                                 </button>


//                             ) : (
//                                 // Edit mode buttons
//                                 <>
//                                     <button
//                                         onClick={handleSave}
//                                         className={`px-3 py-1.5 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center ${isLoading || formatError || !leetcodeInput.trim()
//                                             ? 'bg-gray-400 cursor-not-allowed'
//                                             : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
//                                             }`}
//                                         disabled={isLoading || formatError || !leetcodeInput.trim()}
//                                     >
//                                         <Save className="w-4 h-4 mr-2" />
//                                         {isLoading ? 'Saving...' : 'Save Changes'}
//                                     </button>
//                                     <button
//                                         onClick={cancelEdit}
//                                         className="px-3 py-1.5 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 inline-flex items-center justify-center"
//                                         disabled={isLoading}
//                                     >
//                                         <X className="w-4 h-4 mr-2" />
//                                         Cancel
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function Skeleton() {
//     return (
//         <div className="animate-pulse">
//             <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//             <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
//             <div className="h-10 bg-gray-200 rounded w-full"></div>
//             <div className="flex gap-3 mt-4">
//                 <div className="h-8 w-20 bg-blue-200 rounded-lg"></div>
//                 <div className="h-8 w-20 bg-red-200 rounded-lg"></div>
//             </div>
//         </div>
//     );
// }





"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { SiLeetcode } from "react-icons/si";
import { Settings, Edit3, Save, X } from "lucide-react";
import Nologin from "@/components/Nologin";

export default function Integrate() {
    const { user, setUser, token, loading } = useAuth();
    const [leetcodeInput, setLeetcodeInput] = useState("");
    const [isEditingLeetcode, setIsEditingLeetcode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [originalValue, setOriginalValue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formatError, setFormatError] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.leetcode) {
                setLeetcodeInput(user.leetcode);
                setOriginalValue(user.leetcode);
                setIsEditingLeetcode(false); // User has value, show view mode
            } else {
                setLeetcodeInput("");
                setOriginalValue("");
                setIsEditingLeetcode(true); // No value, auto-enter edit mode
            }
        }
    }, [user]);

    // Check for unsaved changes
    useEffect(() => {
        if (isEditingLeetcode) {
            const currentUsername = extractUsername(leetcodeInput);
            const originalUsername = extractUsername(originalValue);
            setHasUnsavedChanges(currentUsername !== originalUsername);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [leetcodeInput, originalValue, isEditingLeetcode]);

    // Frontend validation function
    const isValidUsernameFormat = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_-]{1,15}$/;
        return usernameRegex.test(username);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLeetcodeInput(value);

        // Clear previous errors when user starts typing
        setError("");
        setSuccess("");
        setFormatError("");

        // Real-time format validation only in edit mode
        if (isEditingLeetcode && value.trim() !== "") {
            const username = extractUsername(value);
            if (!isValidUsernameFormat(username)) {
                setFormatError("Username should be 1-15 characters long and contain only letters, numbers, underscores, and hyphens.");
            }
        }
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

    const enterEditMode = () => {
        setIsEditingLeetcode(true);
        setError("");
        setSuccess("");
        setFormatError("");
    };

    const cancelEdit = () => {
        // If user had no original value, stay in edit mode
        if (!originalValue) {
            setLeetcodeInput("");
            setError("");
            setSuccess("");
            setFormatError("");
            setHasUnsavedChanges(false);
            return;
        }

        // Otherwise, revert to original value and exit edit mode
        setLeetcodeInput(originalValue);
        setIsEditingLeetcode(false);
        setError("");
        setSuccess("");
        setFormatError("");
        setHasUnsavedChanges(false);
    };

    const handleSave = async () => {
        const username = extractUsername(leetcodeInput);

        // Clear previous messages
        setError("");
        setSuccess("");
        setFormatError("");

        // Frontend validation
        if (!username || username.trim() === '') {
            setError("LeetCode username is required.");
            return;
        }

        if (!isValidUsernameFormat(username)) {
            setFormatError("Invalid username format. Username should be 1-15 characters long and contain only letters, numbers, underscores, and hyphens.");
            return;
        }

        try {
            // Set loading state
            setIsLoading(true);

            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/integrate/leetcode`,
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
            setHasUnsavedChanges(false);

            // Show success message
            setSuccess(`LeetCode username updated successfully: ${username}`);

        } catch (error) {
            console.error(`Error integrating LeetCode:`, error);

            // Handle different types of errors
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.status === 400) {
                setError("Invalid LeetCode username or format.");
            } else if (error.response?.status === 404) {
                setError("User not found.");
            } else if (error.response?.status === 429) {
                setError("Too many requests. Please try again in a few minutes.");
            } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                setError("Unable to connect to server. Please check your internet connection.");
            } else {
                setError("Failed to update LeetCode username. Please try again.");
            }
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
                    <div className="min-h-[350px] flex items-center justify-center">  <Nologin message={"Please login to integrate your LeetCode"} /></div>

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
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="leetcode-username" className="text-sm font-semibold text-gray-1000">
                                    LeetCode Username
                                </label>
                                {isEditingLeetcode && (
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                        Editing Mode
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    id="leetcode-username"
                                    type="text"
                                    className={`w-full p-2 text-sm placeholder:text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${isEditingLeetcode
                                        ? 'bg-white border-blue-300 focus:ring-blue-200'
                                        : 'bg-gray-50 border-gray-300 focus:ring-gray-200'
                                        } ${error || formatError ? 'border-red-500' : success ? 'border-green-500' : ''}`}
                                    placeholder={isEditingLeetcode ? "Enter LeetCode username or URL" : "No username connected"}
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

                            {/* Unsaved changes warning */}
                            {hasUnsavedChanges && (
                                <div className="text-amber-600 text-sm mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                                    You have unsaved changes
                                </div>
                            )}

                            {/* Error Messages */}
                            {formatError && (
                                <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                                    {formatError}
                                </div>
                            )}
                            {error && (
                                <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="text-green-600 text-sm mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
                                    {success}
                                </div>
                            )}

                            {leetcodeInput && (
                                <a
                                    href={getProfileUrl(leetcodeInput)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 underline text-sm mt-2 inline-flex items-center"
                                >
                                    View Profile on LeetCode
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {!isEditingLeetcode ? (
                                // View mode buttons
                                <button
                                    onClick={enterEditMode}
                                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 inline-flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Username
                                </button>
                            ) : (
                                // Edit mode buttons
                                <>
                                    <button
                                        onClick={handleSave}
                                        className={`px-3 py-1.5 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center ${isLoading || formatError || !leetcodeInput.trim()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
                                            }`}
                                        disabled={isLoading || formatError || !leetcodeInput.trim()}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Saving...' : originalValue ? 'Save Changes' : 'Connect LeetCode'}
                                    </button>
                                    {originalValue && (
                                        <button
                                            onClick={cancelEdit}
                                            className="px-3 py-1.5 bg-red-400 hover:bg-red-500 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 inline-flex items-center justify-center"
                                            disabled={isLoading}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </button>
                                    )}
                                </>
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