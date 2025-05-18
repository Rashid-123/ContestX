
import { ArrowRight, CheckCircle } from "lucide-react";
export default function Hero() {

    return (

        <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 py-12 sm:py-16 md:py-20 lg:py-24">
            {/* Improved background pattern with better contrast and animation */}
            <div
                className="absolute inset-0 pointer-events-none opacity-70"
                style={{
                    backgroundImage: "radial-gradient(#93c5fd 1px, transparent 0)",
                    backgroundSize: "clamp(20px, 3vw, 30px) clamp(20px, 3vw, 30px)",
                    animation: "pulse 10s ease-in-out infinite alternate"
                }}
            />

            {/* Decorative blurred circles in the background */}
            <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-blue-200 opacity-30 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-indigo-200 opacity-20 blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Badge - with enhanced visual appeal */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center bg-blue-50 border border-blue-100 text-blue-600 px-4 py-2 rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
                        <span className="font-medium text-xs sm:text-sm">Tired of not knowing what to solve next ?</span>
                    </div>
                </div>

                {/* Main heading with improved typography */}
                <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 max-w-4xl mx-auto leading-tight">
                    Master Coding with <span className="text-blue-600">AI-Powered</span> Problem Recommendations
                </h1>

                {/* Subheading with better spacing and readability */}
                <p className="text-center text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Connect your LeetCode account and let our intelligent algorithm map your optimal learning path.
                </p>

                {/* CTA button with more emphasis */}
                <div className="flex justify-center mb-12">
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        Get Started Now <ArrowRight size={16} />
                    </a>
                </div>

                {/* "Why Choose Us" section with improved card design */}
                <div className="mb-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Why Choose Us?</h2>
                    <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mb-8"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Card 1 - with improved visual styling and icon inline with heading */}
                    <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-xs hover:shadow-sm transition-all duration-300 group">
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <div className="text-blue-500 bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 my-auto">Personalized Problem Suggestions</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-center">
                            Connect your LeetCode account, and let our algorithm analyze your solved problems. We suggest new challenges that deepen your understanding of the topics you've explored.
                        </p>
                    </div>

                    {/* Card 2 - with improved visual styling and icon inline with heading */}
                    <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-xs hover:shadow-sm transition-all duration-300 group">
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <div className="text-blue-500 bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 my-auto">Learn <em>Why</em> It Matters</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-center">
                            Stuck on a recommended problem? Get insights on how it's related to your past solutions and guidance on how to approach it. Build clarity and topic mastery, one problem at a time.
                        </p>
                    </div>
                </div>

                {/* Bottom CTA card with improved visual appeal */}
                <div className="mt-12 max-w-5xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 border border-blue-100 shadow-xs">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">Ready to Accelerate Your Learning?</h3>
                                <p className="text-gray-600">
                                    Log in and connect your LeetCode account to start your journey towards coding mastery!
                                </p>
                            </div>
                            <a
                                href="/login"
                                className="w-full md:w-auto inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-center"
                            >
                                Log In to Get Started
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};





