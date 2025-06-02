

// import { ArrowBigRight, Calendar } from "lucide-react";
// import Link from "next/link";

// export default function RecommendationCard({ recommendation }) {
//     const formatDate = (dateString) => {
//         try {
//             const date = new Date(dateString);
//             const options = {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit'
//             };
//             return date.toLocaleDateString('en-US', options);
//         } catch (error) {
//             return "Invalid date";
//         }
//     };

//     return (
//         <div key={recommendation.id} className="bg-white rounded-lg  border border-gray-200 hover:shadow-xs transition-shadow duration-200">
//             <div className="p-4 sm:p-6">
//                 {/* Header */}
//                 <div className="mb-4">
//                     <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-tight">
//                         {recommendation.name}
//                     </h3>

//                     {/* Date with calendar icon */}
//                     <div className="flex items-center text-xs sm:text-sm text-gray-500">
//                         <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
//                         <span className="truncate">{formatDate(recommendation.date)}</span>
//                     </div>
//                 </div>

//                 {/* Problem count */}
//                 <div className="mb-5 sm:mb-6">
//                     <div className="flex items-center text-xs sm:text-sm text-gray-600">
//                         <span className="font-medium text-gray-700">{recommendation.count}</span>
//                         <span className="ml-1">
//                             {recommendation.count === 1 ? 'problem' : 'problems'} identified
//                         </span>
//                     </div>
//                 </div>

//                 {/* Action button */}
//                 <div className="mt-auto">
//                     <Link href={`/recommendation/details/${recommendation.id}`}>
//                         <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 transition-colors duration-150">
//                             <span className="text-sm sm:text-base">Solve problems</span>
//                             <ArrowBigRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }



import { ArrowRight, Calendar, BookOpen } from "lucide-react";
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
        <div className="bg-white rounded-md border border-gray-200 hover:shadow-sm transition-all duration-300">
            <div className="p-5 sm:p-6">
                {/* Header Section */}
                <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight pr-2">
                            {recommendation.name}
                        </h3>
                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {recommendation.count}
                            </span>
                        </div>
                    </div>

                    {/* Date with calendar icon */}
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span>{formatDate(recommendation.date)}</span>
                    </div>
                </div>

                {/* Problem count description */}
                <div className="mb-5">
                    <p className="text-sm text-gray-600">
                        {recommendation.count === 1
                            ? 'One problem ready to solve'
                            : `${recommendation.count} problems ready to solve`
                        }
                    </p>
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-gray-100">
                    <Link href={`/recommendation/details/${recommendation.id}`}>
                        <button className="w-full flex items-center justify-center py-2 px-3 bg-blue-500 hover:bg-blue-600  text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 transition-colors duration-200">
                            <span className="text-sm sm:text-base">Start Solving</span>
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}