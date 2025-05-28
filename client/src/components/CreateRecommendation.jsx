
// "use client";
// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";
// import { Lightbulb } from "lucide-react";
// import { useLeetCode } from "@/context/LeetCodeContext";
// import { useState, useEffect } from "react";
// import { Loader2 } from "lucide-react";
// export default function CreateRecommendation({ username, onCreated }) {
//     const [recommendationName, setRecommendationName] = useState("");
//     const [numberOfProblems, setNumberOfProblems] = useState(5);
//     const [Hard, setHard] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [previousProblems, setPreviousProblems] = useState([]);

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
//             alert("No Previous problems available. Please wait for data to load or check your LeetCode username.");
//             return;
//         }

//         const confirmed = window.confirm(
//             "This will use your credits and cannot be undone. Continue?"
//         );
//         if (!confirmed) return;

//         setLoading(true);

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/api/recommend/",
//                 { problemNumbers: previousProblems, numRecommendations: numberOfProblems, Hard, name: recommendationName },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             console.log("Recommendation created:", response.data);
//             if (onCreated) {
//                 onCreated();
//             }
//             setRecommendationName("");
//             setHard(false);
//         } catch (error) {
//             console.error(
//                 "Error creating recommendation:",
//                 error.response?.data || error.message
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Show loading state


//     // Show error state
//     if (leetCodeError) {
//         return (
//             <div className="flex flex-col bg-white rounded-lg p-4 mb-4">
//                 <div className="flex items-center mb-4">
//                     <Lightbulb className="h-6 w-6 text-blue-500" />
//                     <h2 className="text-lg font-semibold ml-2">Create a Recommendation</h2>
//                 </div>
//                 <div className="bg-red-50 border border-red-200 rounded p-4">
//                     <p className="text-red-700">Error loading LeetCode data: {leetCodeError}</p>
//                     <button
//                         onClick={() => username && fetchLeetCodeData(username)}
//                         className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container flex flex-col rounded-lg p-4 mb-4 mx-auto  max-w-[600px] ">
//             {!isLoading ? (
//                 <div>

//                     <div>
//                         <p className=""> the recommended problems are related to the topic you have  recently solved , if you stuch in solving any recommended problem take the help of insights (message) which help you recall the concept once again and make you problem solving more engazing </p>

//                     </div>
//                     <form className="space-y-3" onSubmit={createRecommendation}>
//                         <label
//                             htmlFor="recommendationName"
//                             className="block text-sm font-medium text-gray-700"
//                         >
//                             Name
//                         </label>
//                         <input
//                             type="text"
//                             id="recommendationName"
//                             name="recommendationName"
//                             placeholder="Any name ( e.g. Daily Practice 1 )"
//                             value={recommendationName}
//                             onChange={(e) => setRecommendationName(e.target.value)}
//                             className="w-full p-2 bg-white border border-gray-300 rounded"
//                             required
//                         />

//                         <label htmlFor="numberOfProblems" className="block text-sm font-medium text-gray-700">
//                             Number of Problems
//                         </label>
//                         <select
//                             id="numberOfProblems"
//                             name="numberOfProblems"
//                             value={numberOfProblems}
//                             onChange={(e) => setNumberOfProblems(Number(e.target.value))}
//                             className="w-full p-2 bg-white border border-gray-300 rounded"
//                             required
//                         >
//                             <option value={5}>5</option>
//                             <option value={10}>10</option>
//                         </select>
//                         <p className="text-md text-gray-600 font-base"> 1 problem cost 1 credit</p>

//                         <div className="flex items-center gap-2">
//                             <input
//                                 type="checkbox"
//                                 id="recommendationHard"
//                                 checked={Hard}
//                                 onChange={(e) => setHard(e.target.checked)}
//                                 className="w-5 h-5 accent-blue-500 cursor-pointer"
//                             />
//                             <label htmlFor="recommendationHard" className="text-md text-gray-800 cursor-pointer">
//                                 Include Hard Problems
//                             </label>
//                         </div>



//                         <button
//                             type="submit"
//                             disabled={loading || previousProblems.length === 0}
//                             className={`w-full bg-purple-500 text-white p-2 rounded transition-colors ${loading || previousProblems.length === 0
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : "hover:bg-purple-600"
//                                 }`}
//                         >
//                             {loading ? "Creating..." : "Create Recommendation"}
//                         </button>
//                     </form>

//                 </div>


//             ) : (

//                 <div className="flex flex-col items-center justify-center min-h-[200px]">
//                     <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
//                 </div>

//             )
//             }

//         </div>);
// }

"use client";
import { useAuth } from "@/context/AuthContext";
import { Lightbulb, Loader2, Info, AlertCircle } from "lucide-react";
import { useLeetCode } from "@/context/LeetCodeContext";
import { useState, useEffect } from "react";

// Modal Component
const CreationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full">
                <div className="text-center">
                    {/* Loader */}
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                    </div>

                    {/* Message */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Creating Your Practice Path
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        Please wait, we are creating the best practice path for you
                    </p>

                    {/* Progress indicator */}
                    <div className="mt-6 w-full bg-gray-100 rounded-full h-1">
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
    const [showModal, setShowModal] = useState(false);

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
            alert("No previous problems available. Please wait for data to load or check your LeetCode username.");
            return;
        }

        const confirmed = window.confirm(
            "This will use your credits and cannot be undone. Continue?"
        );
        if (!confirmed) return;

        setLoading(true);
        setShowModal(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/recommend/",
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
            setShowModal(false);
        }
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
        <>
            <CreationModal isOpen={showModal} onClose={() => setShowModal(false)} />

            {/* <div className="bg-white rounded-lg border-dashed borde-purple-300 shadow-sm overflow-hidden">
               
                <div className="px-5 pt-5 pb-4 md:px-8 md:pt-8 md:pb-6  border-b border-gray-100">

                   
                    <div className="bg-gray-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600 text-sm leading-relaxed">
                                The recommended problems are related to topics you have recently solved.
                                If you get stuck on any recommended problem, use the insights (hints) to
                                help you recall concepts and make problem-solving more engaging.
                            </p>
                        </div>
                    </div>
                </div>

         
                <div className="p-5 md:p-8">
                    <div className="space-y-6">
                       
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recommendation Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Daily Practice Session 1"
                                value={recommendationName}
                                onChange={(e) => setRecommendationName(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                required
                            />
                        </div>

                     
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Problems
                            </label>
                            <select
                                value={numberOfProblems}
                                onChange={(e) => setNumberOfProblems(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                required
                            >
                                <option value={5}>5 Problems</option>
                                <option value={10}>10 Problems</option>
                            </select>
                        </div>

                       
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                    Credit Cost:
                                </span>
                                <div className="flex items-center">
                                    <span className="text-lg font-semibold text-purple-600">
                                        {numberOfProblems}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">
                                        credit{numberOfProblems !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                1 problem = 1 credit
                            </p>
                        </div>

                     
                        <div className="flex items-center">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="includeHard"
                                    checked={Hard}
                                    onChange={(e) => setHard(e.target.checked)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="includeHard"
                                    className="flex items-center cursor-pointer"
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${Hard
                                        ? 'bg-purple-500 border-purple-500'
                                        : 'bg-white border-gray-300 hover:border-purple-300'
                                        }`}>
                                        {Hard && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Include Hard Problems
                                    </span>
                                </label>
                            </div>
                        </div>

                    
                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={createRecommendation}
                                disabled={loading || previousProblems.length === 0}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${loading || previousProblems.length === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-purple-500 text-white hover:bg-purple-600 hover:shadow-md active:transform active:scale-[0.98]"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Creating...
                                    </div>
                                ) : (
                                    "Create Recommendation"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>  */}


            <div className="bg-white rounded-lg border-dashed border-purple-300 shadow-sm overflow-hidden max-w-2xl mx-auto">
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
                                />
                                <label
                                    htmlFor="includeHard"
                                    className="flex items-center cursor-pointer"
                                >
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-2 transition-colors ${Hard
                                        ? 'bg-purple-500 border-purple-500'
                                        : 'bg-white border-gray-300 hover:border-purple-300'
                                        }`}>
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
                                onClick={createRecommendation}
                                disabled={loading || previousProblems.length === 0}
                                className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${loading || previousProblems.length === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-purple-500 text-white hover:bg-purple-600 hover:shadow-md active:transform active:scale-[0.98]"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                                        Creating...
                                    </div>
                                ) : (
                                    "Create Recommendation"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
