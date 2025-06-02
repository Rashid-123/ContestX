
"use client";

import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Crown, Zap } from "lucide-react";

export default function Payment() {
    const { token, user, setUser, loading } = useAuth();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBuyCredits = async (amount, credits) => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet.");
            return;
        }

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                order_id: data.id,
                name: "NextStep",

                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                creditsPurchased: credits,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        console.log("Payment verification response:", verifyRes.data);

                        if (verifyRes.data.success) {
                            setUser(prevUser => ({
                                ...prevUser,
                                credits: verifyRes.data.credits
                            }));

                            alert(`Payment successful! ${credits} credits added. Total credits: ${verifyRes.data.credits}`);
                        }
                    } catch (error) {
                        console.error("Error verifying payment:", error);
                        alert("Payment verification failed. Please contact support.");
                    }
                },

                prefill: {
                    name: user?.name || "Test User",
                    email: user?.email || "test@example.com",
                },
                theme: {
                    color: "#1f2937",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Something went wrong during payment. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Unlock AI-powered problem recommendations and accelerate your coding journey
                    </p>
                </div>

                {/* Current Credits */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-sm sm:text-base md:text-lg font-medium text-gray-600">Current Balance :</span>
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700">{user?.credits || 0}</span>
                        <span className="text-sm sm:text-base md:text-lg text-gray-500">credits</span>
                    </div>
                </div>

                {/* Pricing Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                    {/* Starter Plan */}
                    <div className="bg-white border-2 border-blue-100 rounded-lg p-8 hover:border-blue-200 transition-colors">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg mb-4">
                                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Starter</h3>
                            <div className="mb-4">
                                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">₹199</span>
                            </div>
                            <p className="text-gray-600">50 Credits • ₹4.0 per credit</p>
                        </div>

                        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm sm:text-base text-gray-700">50 AI Problem Recommendations</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm sm:text-base text-gray-700">Advance Contextual Help</span>
                            </div>

                        </div>

                        <button
                            onClick={() => handleBuyCredits(199, 50)}
                            className="w-full bg-blue-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-white hover:text-gray-600 border border-blue-400 transition-colors"
                        >
                            Get Starter Plan
                        </button>
                    </div>

                    {/* Power Plan */}
                    <div className="bg-white border-2 border-purple-300 rounded-lg p-8 relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-purple-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                BEST VALUE
                            </span>
                        </div>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-400 rounded-lg mb-4">
                                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Power</h3>
                            <div className="mb-4">
                                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">₹499</span>
                            </div>
                            <p className="text-gray-600">150 Credits • ₹3.33 per credit</p>
                            <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                                save ₹100
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm sm:text-base text-gray-700">110 AI Problem Recommendations</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span className="text-sm sm:text-base text-gray-700">Advanced Contextual Help</span>
                            </div>

                        </div>

                        <button
                            onClick={() => handleBuyCredits(499, 150)}
                            className="w-full bg-purple-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-white hover:text-gray-600 border border-purple-400 transition-colors"
                        >
                            Get Power Plan
                        </button>
                    </div>
                </div>

                {/* Value Proposition */}
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Our Credits?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
                            <p className="text-gray-600">AI analyzes your progress to suggest the most relevant problems for your skill level</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contextual Guidance</h3>
                            <p className="text-gray-600">Get hints and explanations that connect to problems you've already solved</p>
                        </div>


                    </div>
                </div>

                {/* Security */}
                <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Secured by Razorpay • SSL Encrypted
                    </div>
                </div>

            </div>
        </div>
    );
}