

// "use client";
// import { useAuth } from "@/context/AuthContext";
// import { Lightbulb, Loader2, Info, AlertCircle } from "lucide-react";
// import { useLeetCode } from "@/context/LeetCodeContext";
// import { useState, useEffect } from "react";

// // Modal Component
// const CreationModal = ({ isOpen, onClose }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//             {/* Backdrop */}
//             <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

//             {/* Modal Content */}
//             <div className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full">
//                 <div className="text-center">
//                     {/* Loader */}
//                     <div className="mb-6">
//                         <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
//                             <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
//                         </div>
//                     </div>

//                     {/* Message */}
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                         Creating Your Practice Path
//                     </h3>
//                     <p className="text-gray-600 leading-relaxed">
//                         Please wait, we are creating the best practice path for you
//                     </p>

//                     {/* Progress indicator */}
//                     <div className="mt-6 w-full bg-gray-100 rounded-full h-1">
//                         <div className="bg-purple-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default function CreateRecommendation({ username, onCreated }) {
//     const [recommendationName, setRecommendationName] = useState("");
//     const [numberOfProblems, setNumberOfProblems] = useState(5);
//     const [Hard, setHard] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [previousProblems, setPreviousProblems] = useState([]);
//     const [showModal, setShowModal] = useState(false);

//     const { token } = useAuth();
//     const { submissions, isLoading, leetCodeError, fetchLeetCodeData } = useLeetCode();

//     useEffect(() => {
//         console.log("Username effect triggered:", username);
//         if (username) {
//             console.log("Calling fetchLeetCodeData for:", username);
//             fetchLeetCodeData(username);
//         }
//     }, [username, fetchLeetCodeData]);

//     useEffect(() => {
//         console.log("Submissions effect triggered:", submissions);
//         if (submissions && submissions.length > 0) {
//             const numbers = submissions.map((submission) => submission.number);
//             setPreviousProblems(numbers);
//             console.log("Set problem numbers:", numbers);
//         } else {
//             console.log("No submissions available or empty array");
//             setPreviousProblems([]);
//         }
//     }, [submissions]);

//     const createRecommendation = async (e) => {
//         e.preventDefault();

//         if (previousProblems.length === 0) {
//             alert("No previous problems available. Please wait for data to load or check your LeetCode username.");
//             return;
//         }

//         const confirmed = window.confirm(
//             "This will use your credits and cannot be undone. Continue?"
//         );
//         if (!confirmed) return;

//         setLoading(true);
//         setShowModal(true);

//         try {
//             const response = await fetch(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommend/`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         problemNumbers: previousProblems,
//                         numRecommendations: numberOfProblems,
//                         Hard,
//                         name: recommendationName
//                     })
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error('Failed to create recommendation');
//             }

//             const data = await response.json();
//             console.log("Recommendation created:", data);

//             if (onCreated) {
//                 onCreated();
//             }
//             setRecommendationName("");
//             setHard(false);
//         } catch (error) {
//             console.error(
//                 "Error creating recommendation:",
//                 error.message
//             );
//         } finally {
//             setLoading(false);
//             setShowModal(false);
//         }
//     };

//     // Show error state
//     if (leetCodeError) {
//         return (
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
//                 <div className="text-center">
//                     <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <AlertCircle className="w-6 h-6 text-red-500" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                         Unable to Load LeetCode Data
//                     </h3>
//                     <p className="text-gray-600 mb-6">
//                         {leetCodeError}
//                     </p>
//                     <button
//                         onClick={() => username && fetchLeetCodeData(username)}
//                         className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // Show loading state
//     if (isLoading) {
//         return (
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
//                 <div className="text-center">
//                     <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                         Loading Your Data
//                     </h3>
//                     <p className="text-gray-600">
//                         Fetching your LeetCode submission history...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <CreationModal isOpen={showModal} onClose={() => setShowModal(false)} />




//             <div className="bg-white rounded-lg border-dashed border-purple-300 shadow-sm overflow-hidden max-w-2xl mx-auto">
//                 {/* Header Section */}
//                 <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5 md:pb-4 border-b border-gray-100">
//                     {/* Description */}
//                     <div className="bg-gray-50 rounded-md p-3 border border-slate-200">
//                         <div className="flex items-start">
//                             <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
//                             <p className="text-gray-600 text-xs leading-relaxed">
//                                 The recommended problems are related to topics you have recently solved.
//                                 If you get stuck on any recommended problem, use the insights (hints) to
//                                 help you recall concepts and make problem-solving more engaging.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Form Section */}
//                 <div className="p-4 md:p-6">
//                     <div className="space-y-4">
//                         {/* Recommendation Name */}
//                         <div>
//                             <label className="block text-xs font-medium text-gray-700 mb-2">
//                                 Recommendation Name
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="e.g., Daily Practice Session 1"
//                                 value={recommendationName}
//                                 onChange={(e) => setRecommendationName(e.target.value)}
//                                 className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
//                                 required
//                             />
//                         </div>

//                         {/* Number of Problems */}
//                         <div>
//                             <label className="block text-xs font-medium text-gray-700 mb-2">
//                                 Number of Problems
//                             </label>
//                             <select
//                                 value={numberOfProblems}
//                                 onChange={(e) => setNumberOfProblems(Number(e.target.value))}
//                                 className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
//                                 required
//                             >
//                                 <option value={5}>5 Problems</option>
//                                 <option value={10}>10 Problems</option>
//                             </select>
//                         </div>

//                         {/* Credit Cost Info */}
//                         <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-xs font-medium text-gray-700">
//                                     Credit Cost:
//                                 </span>
//                                 <div className="flex items-center">
//                                     <span className="text-base font-semibold text-purple-600">
//                                         {numberOfProblems}
//                                     </span>
//                                     <span className="text-xs text-gray-500 ml-1">
//                                         credit{numberOfProblems !== 1 ? 's' : ''}
//                                     </span>
//                                 </div>
//                             </div>
//                             <p className="text-xs text-gray-500 mt-0.5">
//                                 1 problem = 1 credit
//                             </p>
//                         </div>

//                         {/* Hard Problems Checkbox */}
//                         <div className="flex items-center">
//                             <div className="relative">
//                                 <input
//                                     type="checkbox"
//                                     id="includeHard"
//                                     checked={Hard}
//                                     onChange={(e) => setHard(e.target.checked)}
//                                     className="sr-only"
//                                 />
//                                 <label
//                                     htmlFor="includeHard"
//                                     className="flex items-center cursor-pointer"
//                                 >
//                                     <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-2 transition-colors ${Hard
//                                         ? 'bg-purple-500 border-purple-500'
//                                         : 'bg-white border-gray-300 hover:border-purple-300'
//                                         }`}>
//                                         {Hard && (
//                                             <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                             </svg>
//                                         )}
//                                     </div>
//                                     <span className="text-xs font-medium text-gray-700 m-2">
//                                         Include Hard Problems
//                                     </span>
//                                 </label>
//                             </div>
//                         </div>

//                         {/* Submit Button */}
//                         <div className="pt-2">
//                             <button
//                                 type="button"
//                                 onClick={createRecommendation}
//                                 disabled={loading || previousProblems.length === 0}
//                                 className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${loading || previousProblems.length === 0
//                                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                     : "bg-purple-500 text-white hover:bg-purple-600 hover:shadow-md active:transform active:scale-[0.98]"
//                                     }`}
//                             >
//                                 {loading ? (
//                                     <div className="flex items-center justify-center">
//                                         <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
//                                         Creating...
//                                     </div>
//                                 ) : (
//                                     "Create Recommendation"
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }




"use client";
import { useAuth } from "@/context/AuthContext";
import { Lightbulb, Loader2, Info, AlertCircle } from "lucide-react";
import { useLeetCode } from "@/context/LeetCodeContext";
import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
// Confirmation Popup Component
const ConfirmationPopup = ({ isOpen, onConfirm, onCancel, credits }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg"></div>

            {/* Popup Content */}
            <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 p-6 mx-4 max-w-sm w-full">
                <div className="text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-purple-500" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Confirm Creation
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                        This will use <span className="font-semibold text-purple-600">{credits} credit{credits !== 1 ? 's' : ''}</span> and cannot be undone.
                    </p>

                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Processing Popup Component
const ProcessingPopup = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg"></div>

            {/* Popup Content */}
            <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 p-6 mx-4 max-w-sm w-full">
                <div className="text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Creating Your Practice Path
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                        Please wait while we create your recommendations.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-xs font-medium">
                            ⚠️ Please don't refresh or leave this page
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-1">
                        <div className="bg-purple-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CreateRecommendation({ username, onCreated }) {
    const [recommendationName, setRecommendationName] = useState("");
    const [numberOfProblems, setNumberOfProblems] = useState(5);
    const [Hard, setHard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previousProblems, setPreviousProblems] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);

    const { user, setUser, token } = useAuth();
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

    const handleCreateClick = (e) => {

        if (user.credits < numberOfProblems) {
            toast.error("Please buy some credits.");
            return;
        }

        e.preventDefault();

        if (previousProblems.length === 0) {
            alert("No previous problems available. Please wait for data to load or check your LeetCode username.");
            return;
        }

        setShowConfirmation(true);
    };

    const handleConfirmCreation = async () => {
        setShowConfirmation(false);
        setLoading(true);
        setShowProcessing(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommend/`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        problemNumbers: previousProblems,
                        numRecommendations: numberOfProblems,
                        Hard,
                        name: recommendationName
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create recommendation');
            }

            const data = await response.json();
            console.log("Recommendation created:", data);

            setUser(prevUser => ({
                ...prevUser,
                credits: data.credits
            }));

            if (onCreated) {
                onCreated();
            }

            setRecommendationName("");
            setHard(false);
        } catch (error) {
            console.error(
                "Error creating recommendation:",
                error.message
            );
        } finally {
            setLoading(false);
            setShowProcessing(false);
        }
    };

    const handleCancelCreation = () => {
        setShowConfirmation(false);
    };

    // Show error state
    if (leetCodeError) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Unable to Load LeetCode Data
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {leetCodeError}
                    </p>
                    <button
                        onClick={() => username && fetchLeetCodeData(username)}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Loading Your Data
                    </h3>
                    <p className="text-gray-600">
                        Fetching your LeetCode submission history...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border-dashed border-purple-300 shadow-sm overflow-hidden max-w-2xl mx-auto relative">
            {/* Popups */}
            <ConfirmationPopup
                isOpen={showConfirmation}
                onConfirm={handleConfirmCreation}
                onCancel={handleCancelCreation}
                credits={numberOfProblems}
            />

            <ProcessingPopup isOpen={showProcessing} />

            {/* Header Section */}
            <div className="px-4 pt-4 pb-3 md:px-6 md:pt-5 md:pb-4 border-b border-gray-100">
                {/* Description */}
                <div className="bg-gray-50 rounded-md p-3 border border-slate-200">
                    <div className="flex items-start">
                        <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-600 text-xs leading-relaxed">
                            The recommended problems are related to topics you have recently solved.
                            If you get stuck on any recommended problem, use the insights (hints) to
                            help you recall concepts and make problem-solving more engaging.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="p-4 md:p-6">
                <div className="space-y-4">
                    {/* Recommendation Name */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Recommendation Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Daily Practice Session 1"
                            value={recommendationName}
                            onChange={(e) => setRecommendationName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Number of Problems */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Number of Problems
                        </label>
                        <select
                            value={numberOfProblems}
                            onChange={(e) => setNumberOfProblems(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                            required
                            disabled={loading}
                        >
                            <option value={5}>5 Problems</option>
                            <option value={10}>10 Problems</option>
                        </select>
                    </div>

                    {/* Credit Cost Info */}
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">
                                Credit Cost:
                            </span>
                            <div className="flex items-center">
                                <span className="text-base font-semibold text-purple-600">
                                    {numberOfProblems}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">
                                    credit{numberOfProblems !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            1 problem = 1 credit
                        </p>
                    </div>

                    {/* Hard Problems Checkbox */}
                    <div className="flex items-center">
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="includeHard"
                                checked={Hard}
                                onChange={(e) => setHard(e.target.checked)}
                                className="sr-only"
                                disabled={loading}
                            />
                            <label
                                htmlFor="includeHard"
                                className={`flex items-center ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-2 transition-colors ${Hard
                                    ? 'bg-purple-500 border-purple-500'
                                    : 'bg-white border-gray-300 hover:border-purple-300'
                                    } ${loading ? 'opacity-50' : ''}`}>
                                    {Hard && (
                                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-gray-700 m-2">
                                    Include Hard Problems
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={handleCreateClick}
                            disabled={loading || previousProblems.length === 0}
                            className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${loading || previousProblems.length === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-purple-500 text-white hover:bg-purple-600 hover:shadow-md active:transform active:scale-[0.98]"
                                }`}
                        >
                            Create Recommendation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}