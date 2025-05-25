"use client";

import { Loader2, Lightbulb } from "lucide-react";

export default function LoadingModal({ isOpen, message = "Please wait, we are creating the best recommendation for you" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <Lightbulb className="h-12 w-12 text-blue-500" />
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600 absolute -top-1 -right-1" />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Creating Recommendation
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="mt-6">
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}