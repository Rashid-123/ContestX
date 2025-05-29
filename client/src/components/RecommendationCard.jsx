

import { ArrowBigRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function RecommendationCard({ recommendation }) {
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            return "Invalid date";
        }
    };

    return (
        <div key={recommendation.id} className="bg-white rounded-lg  border border-gray-200 hover:shadow-xs transition-shadow duration-200">
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-tight">
                        {recommendation.name}
                    </h3>

                    {/* Date with calendar icon */}
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{formatDate(recommendation.date)}</span>
                    </div>
                </div>

                {/* Problem count */}
                <div className="mb-5 sm:mb-6">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <span className="font-medium text-gray-700">{recommendation.count}</span>
                        <span className="ml-1">
                            {recommendation.count === 1 ? 'problem' : 'problems'} identified
                        </span>
                    </div>
                </div>

                {/* Action button */}
                <div className="mt-auto">
                    <Link href={`/recommendation/details/${recommendation.id}`}>
                        <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 transition-colors duration-150">
                            <span className="text-sm sm:text-base">Solve problems</span>
                            <ArrowBigRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}