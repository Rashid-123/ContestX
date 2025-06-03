"use client";

import { ArrowRight, CheckCircle, Zap, Crown, Gift } from "lucide-react";
import { useEffect } from "react";
export default function Hero() {

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ping`).catch(console.error);
        }, 1000)

        return () => clearTimeout(timer);
    }, [])

    return (
        <div>
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
                        Master Problem solving with <span className="text-blue-600">AI-Powered</span> Problem Recommendations
                    </h1>

                    {/* Subheading with better spacing and readability */}
                    <p className="text-center text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Connect your LeetCode account and let our intelligent algorithm map your optimal learning path.
                    </p>

                    {/* CTA button with more emphasis */}
                    <div className="flex justify-center mb-12">
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-blue-500 text-white font-medium md:font-semibold   rounded-md shadow-lg hover:bg-blue-600 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            Get Started Now <ArrowRight size={16} />
                        </a>
                    </div>

                    {/* "Why Choose Us" section with improved card design */}
                    <div className="mb-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Why Choose <span className="text-xl md:text-2xl" style={{ fontFamily: 'orbitron' }}>Next<span className="text-blue-600">Step</span></span> ?</h2>
                        {/* <h2 className="  text-3xl font-bold text-gray-800 sm:text-4xl mb-2">Why Choose NextStep?</h2> */}



                        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mb-8"></div>
                    </div>

                    <div className="grid grid-cols-1  md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                        <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-xs hover:shadow-sm transition-all duration-300 group">
                            {/* Icon positioned on the left */}
                            <div className="flex justify-start mb-4">
                                <div className="text-purple-500 bg-purple-100 p-2 rounded-md w-9 h-9 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Title below icon */}
                            <h3 className="md:text-xl text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-3">
                                Personalized Problem Suggestions
                            </h3>

                            {/* Description below title */}
                            <p className="text-gray-700 leading-relaxed">
                                Get AI-powered recommendations based on the problems you've recently solved, tailored to your learning pace and skill level.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-xs hover:shadow-sm transition-all duration-300 group">
                            {/* Icon positioned on the left */}
                            <div className="flex justify-start mb-4">
                                <div className="text-blue-500 bg-blue-100 p-2 rounded-md w-9 h-9 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Title below icon */}
                            <h3 className="md:text-xl text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-3">
                                Smart Follow-Up Guidance
                            </h3>

                            {/* Description below title */}
                            <p className="text-gray-700 leading-relaxed">
                                When you're stuck, receive insights that explain how the current problem connects to your past practice and how to approach it effectively.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-xs hover:shadow-sm transition-all duration-300 group">
                            {/* Icon positioned on the left */}
                            <div className="flex justify-start mb-4">
                                <div className="text-pink-400 bg-pink-100 p-2 rounded-md w-9 h-9 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-300">

                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9l-5.91 5.64L17.82 22 12 18.27 6.18 22l1.73-7.36L2 9l6.91-.74L12 2z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Title below icon */}
                            <h3 className="md:text-xl text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-3">
                                Practice Without Bias
                            </h3>

                            {/* Description below title */}
                            <p className="text-gray-700 leading-relaxed">
                                Skip manual tag filtering — solve problems based on your actual progress, not what you already know. This keeps your learning challenging and more effective.
                            </p>
                        </div>




                    </div>
                    <div className=" py-16 md:py-24">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
                                    How it works
                                </h2>
                                <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                                    Get started in just a few simple steps
                                </p>
                                <div className="h-1 w-30 bg-blue-500 mx-auto rounded-full mb-8 mt-2"></div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-6">
                                        1
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Login and Integrate Your LeetCode Account</h3>
                                    <p className="text-gray-700">
                                        Sign in and link your LeetCode username so we can understand your progress and fetch your recent activity automatically.                                </p>
                                </div>

                                {/* Step 2 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-6">
                                        2
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Receive Personalized Problem Recommendations</h3>
                                    <p className="text-gray-700">
                                        Based on your most recently solved problems, our AI suggests new challenges tailored to your level, helping you grow efficiently.
                                    </p>
                                </div>

                                {/* Step 3 */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-6">
                                        3
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">Get Contextual Help When You're Stuck</h3>
                                    <p className="text-gray-700">
                                        If you’re stuck, the platform shows how the problem relates to your past ones, guides your next steps, and keeps problem-solving engaging.                                </p>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div>
            <div className="px-5 max-w-6xl mx-auto">
                <div className="mt-16 mb-12 max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-2">Pricing Plans</h2>
                        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mb-4"></div>
                        <p className="text-sm sm:text-base text-gray-600">Start with 50 free credits, then choose a plan that fits your needs</p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {/* Free Plan */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-green-200 shadow-xs hover:shadow-sm transition-all duration-300">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3">
                                    <Gift className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Free Start</h3>
                                <div className="text-2xl font-bold text-green-600 mb-1">₹0</div>
                                <p className="text-sm text-gray-600">50 Free Credits</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700">50 AI Recommendations</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700">Basic Contextual Help</span>
                                </div>
                            </div>
                        </div>

                        {/* Starter Plan */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-blue-200 shadow-xs hover:shadow-sm transition-all duration-300">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-3">
                                    <Zap className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Starter</h3>
                                <div className="text-2xl font-bold text-gray-800 mb-1">₹199</div>
                                <p className="text-sm text-gray-600">50 Credits • ₹4.0 per credit</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700">50 AI Recommendations</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700">Advanced Contextual Help</span>
                                </div>
                            </div>
                        </div>

                        {/* Power Plan */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-purple-300 shadow-xs hover:shadow-sm transition-all duration-300 relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    BEST VALUE
                                </span>
                            </div>
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-3">
                                    <Crown className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Power</h3>
                                <div className="text-2xl font-bold text-gray-800 mb-1">₹499</div>
                                <p className="text-sm text-gray-600">150 Credits • ₹3.33 per credit</p>
                                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mt-1">
                                    Save ₹100
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700">110 AI Recommendations</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700">Advanced Contextual Help</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Secured by Razorpay
                            </span>
                        </p>
                    </div>
                </div>


                <div className="m-12 max-w-5xl mx-auto">
                    <div className="bg-white rounded-xl p-4 sm:p-8 border border-green-200 ">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                                    Ready to Accelerate Your Learning?
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700">
                                    Log in and connect your LeetCode account to start your journey towards coding mastery!
                                </p>
                            </div>
                            <a
                                href="/login"
                                className="w-full md:w-auto inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-green-50 text-green-600 text-sm sm:text-base font-semibold rounded-md border border-green-200 hover:bg-green-200 transition duration-300 text-center"
                            >
                                Log In to Get Started
                            </a>
                        </div>
                    </div>
                </div></div>

        </div>
    );
};




