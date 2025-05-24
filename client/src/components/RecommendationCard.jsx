


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
        <div key={recommendation.id} className="bg-white rounded-md shadow-xs hover:shadow-md transition-all duration-300 border border-blue-100 hover:border-blue-200 group">

            <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                        {recommendation.name}
                    </h3>

                    {/* Date with calendar icon */}
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                        <span>{formatDate(recommendation.date)}</span>
                    </div>
                </div>

                {/* Problem count badge */}
                <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {recommendation.count} problems
                    </span>
                </div>

                {/* Action button */}
                <div className="mt-auto">
                    <Link href={`/recommendation/details/${recommendation.id}`}>
                        <button className="w-full flex items-center justify-center py-2 border border-blue-200 rounded-md bg-gray-50  text-gray-700 font-medium transition-all duration-200 shadow-xs transform">
                            <span>Solve problems</span>
                            <ArrowBigRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </button> </Link>
                </div>
            </div>

        </div>
    );
}