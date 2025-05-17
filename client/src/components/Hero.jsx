export default function Heor() {

    // return (
    //     <div className="hero-section bg-dotted background-color-1 flex flex-col items-center justify-center text-center px-4 py-16 ">
    //         <p className="text-lg sm:text-xl text-gray-600 mb-2">
    //             Tired of not knowing what to solve next?
    //         </p>
    //         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
    //             Master Coding with AI-Powered Problem Recommendations
    //         </h1>

    //         <p className="text-lg sm:text-xl text-gray-600 mb-2">
    //             Connect your LeetCode account and let our smart algorithm guide your journey.
    //         </p>
    //         <p className="text-lg sm:text-xl text-gray-600 mb-4">
    //             Get tailored coding problems based on your recent activity and skill level.
    //         </p>
    //         <ul className="text-gray-700 mb-6 space-y-1">
    //             <li>🔍 <span className="font-medium">Personalized</span></li>
    //             <li>🎯 <span className="font-medium">Targeted</span></li>
    //             <li>📈 <span className="font-medium">Smarter Practice</span></li>
    //         </ul>
    //         <p className="text-md text-gray-600 mb-4">
    //             Start your journey today – it's free!
    //         </p>
    //         <div className="hero-buttons flex space-x-4">
    //             <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
    //                 Connect LeetCode Username
    //             </button>
    //             <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
    //                 Sign Up
    //             </button>
    //         </div>
    //     </div>

    // )
    return (
        <div className="hero-section  flex flex-col items-center justify-center text-center px-4 py-16 relative overflow-hidden">
            {/* Background dots layer with gradient mask */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#bfdbfe 1px, transparent 0)",
                    backgroundSize: "clamp(20px, 4vw, 30px) clamp(20px, 4vw, 30px)",
                    maskImage: "linear-gradient(to top right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
                    WebkitMaskImage: "linear-gradient(to top right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)"
                }}>
            </div>

            {/* Content layer */}
            <div className="relative z-10">
                <p className="text-sm sm:text-base md:text-md font-semibold text-blue-400 bg-blue-50 rounded-xl px-1 py-2 mb-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto inline-block ">
                    Tired of not knowing what to solve next ?
                </p>


                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-700 mb-4 max-w-5xl mx-auto leading-tight">
                    Master Coding with AI-Powered Problem Recommendations
                </h1>

                <p className="tracking-[0.01em]  text-base sm:text-md md:text-lg text-gray-600 mb-3 max-w-2xl mx-auto leading-snug">
                    Connect your LeetCode account and let our intelligent algorithm map your optimal learning path.
                </p>

                <ul className="text-gray-700 mb-6 space-y-1">
                    <li>🔍 <span className="font-medium">Personalized</span></li>
                    <li>🎯 <span className="font-medium">Targeted</span></li>
                    <li>📈 <span className="font-medium">Smarter Practice</span></li>
                </ul>
                <p className="text-md text-gray-600 mb-4">
                    Start your journey today – it's free!
                </p>
                <div className="hero-buttons flex space-x-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Connect LeetCode Username
                    </button>
                    <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}