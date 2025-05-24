
// import React from 'react';
// import { ExternalLink } from 'lucide-react';

// export default function SubmissionItem({ submission }) {
//     const submissionDate = new Date(Number(submission.submissionTime) * 1000).toLocaleString();
//     const problemLink = `https://leetcode.com/problems/${submission.titleSlug}`;
//     const { title, difficulty, lang, status } = submission;

//     const difficultyColor =
//         difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
//             difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
//                 'text-red-600 bg-red-100';

//     return (
//         <li className="p-3 sm:p-5 border border-gray-200 rounded-lg sm:rounded-2xl">

//             <div className="flex items-center justify-between gap-2 mb-2">
//                 <h6 className="text-blue-500 font-medium text-sm sm:text-base truncate">
//                     {title}
//                 </h6>
//                 <a
//                     href={problemLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
//                     aria-label="Open problem in LeetCode"
//                 >
//                     <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hover:text-gray-800" />
//                 </a>
//             </div>


//             <div className="flex flex-wrap items-center gap-y-2">

//                 <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mr-auto">
//                     <span className={`text-xs sm:text-sm font-medium ${status === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
//                         {status}
//                     </span>
//                     <span className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0">
//                         {submissionDate}
//                     </span>
//                 </div>


//                 <div className="flex gap-2 mt-1 sm:mt-0">
//                     <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColor}`}>
//                         {difficulty}
//                     </span>
//                     <span className="px-2 py-0.5 rounded-md text-xs font-medium border border-gray-200 bg-blue-50">
//                         {lang}
//                     </span>
//                 </div>
//             </div>
//         </li>
//     );
// }



import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function SubmissionItem({ submission }) {
    const submissionDate = new Date(Number(submission.submissionTime) * 1000).toLocaleString();
    const problemLink = `https://leetcode.com/problems/${submission.titleSlug}`;
    const { title, difficulty, lang, status } = submission;

    const difficultyColor =
        difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
            difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                'text-red-600 bg-red-100';

    return (
        <li className="p-3 sm:p-5 border border-gray-200 rounded-lg sm:rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-blue-500 font-medium text-sm sm:text-base truncate hover:text-blue-600 transition-colors">
                    {title}
                </p>
                <a
                    href={problemLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-1 hover:bg-blue-50 rounded-full transition-colors group"
                    aria-label="Open problem in LeetCode"
                >
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hover:text-blue-500 group-hover:scale-110 transition-all duration-200" />
                </a>
            </div>

            <div className="flex flex-wrap items-center gap-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mr-auto">
                    <span className={`text-xs sm:text-sm font-medium ${status === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0">
                        {submissionDate}
                    </span>
                </div>

                <div className="flex gap-2 mt-1 sm:mt-0">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColor} border border-opacity-20`}>
                        {difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium border border-blue-200 bg-blue-50 text-blue-700">
                        {lang}
                    </span>
                </div>
            </div>
        </li>
    );
}