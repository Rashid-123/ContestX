export default function Hero() {

    return (
        <div className="hero-section  flex flex-col items-center justify-center text-center px-4 py-16 relative overflow-hidden ">
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
                <div>
                    <p className="text-sm sm:text-base md:text-md font-semibold text-blue-400 bg-blue-50 rounded-xl px-1 py-2 mb-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto inline-block ">
                        Tired of not knowing what to solve next ? </p>


                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-5 max-w-5xl mx-auto leading-tight">
                        Master Coding with AI-Powered Problem Recommendations
                    </h1>

                    <p className="tracking-[0.01em]  text-base sm:text-md md:text-lg text-gray-900 mb-3 max-w-2xl mx-auto leading-snug">
                        Connect your LeetCode account and let our intelligent algorithm map your optimal learning path.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-700 mb-4 mt-8">Why Choose Us ?</h2>

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-4  sm-px-1  md:px-8 mx-auto max-w-5xl">
                    <div className="bg-slate-50 rounded-xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-sm w-full">
                        <h2 className="text-xl font-semibold mb-2">🔍 Personalized Problem Suggestions</h2>
                        <p className="tracking-[0.01em]  text-base sm:text-md md:text-lg text-gray-800 mb-3 max-w-2xl mx-auto leading-snug">
                            Connect your LeetCode account, and let our algorithm analyze your solved problems. We suggest new challenges that deepen your understanding of the topics you’ve explored.
                        </p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-sm w-full">
                        <h2 className="text-xl font-semibold mb-2">🧠 Learn <em>Why</em> It Matters</h2>
                        <p className="tracking-[0.01em]  text-base sm:text-md md:text-lg text-gray-800 mb-3 max-w-2xl mx-auto leading-snug">
                            Stuck on a recommended problem? Get insights on how it’s related to your past solutions and guidance on how to approach it. Build clarity and topic mastery, one problem at a time.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1  mt-8 px-4  sm:px-1  md:px-8 mx-auto max-w-5xl ">
                    <div className="bg-white text-center flex flex-col md:flex-row items-center justify-between gap-4 px-6 sm:px-6 m-4  mx-auto rounded-xl  border border-blue-100 p-6">
                        <p className="tracking-[0.01em]  text-base sm:text-md md:text-lg text-gray-700 mb-3 max-w-2xl mx-auto leading-snug">
                            Ready to get personalized problem suggestions? Log in and connect your LeetCode account to start your journey towards coding mastery!
                        </p>

                        <a
                            href="/login"
                            className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            Log In to Get Started
                        </a>
                    </div></div>





            </div>

        </div>


    )
}
