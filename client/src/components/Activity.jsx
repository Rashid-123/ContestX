


'use client';
import { useEffect } from 'react';
import { useLeetCode } from '@/context/LeetCodeContext';
import SubmissionItem from '@/components/SubmissionItem';
import { User } from 'lucide-react';
import Nolinked from './Nolinked';
// Skeleton component for loading state
function SubmissionSkeleton() {
    return (
        <li className="p-3 sm:p-5 border border-gray-200 rounded-lg sm:rounded-2xl animate-pulse">
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                <div className="h-4 w-4 bg-blue-100 rounded-full flex-shrink-0"></div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mr-auto">
                    <div className="h-3 bg-green-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mt-0.5 sm:mt-0"></div>
                </div>

                <div className="flex gap-2 mt-1 sm:mt-0">
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                    <div className="h-5 bg-gray-200 rounded w-10"></div>
                </div>
            </div>
        </li>
    );
}

// Loading skeleton for multiple items
function LoadingSkeleton() {
    return (
        <ul className="space-y-4 overflow-y-auto mt-4 pr-2" style={{ maxHeight: '450px' }}>
            {[...Array(5)].map((_, index) => (
                <SubmissionSkeleton key={index} />
            ))}
        </ul>
    );
}




export default function Activity({ username }) {
    const { submissions, isLoading, leetcodeError, fetchLeetCodeData } = useLeetCode();

    useEffect(() => {
        if (username) {
            fetchLeetCodeData(username);
        }
    }, [username, fetchLeetCodeData]);

    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold">Recent LeetCode Submissions</h2>
            <span className="text-xs sm:text-sm mb-1" style={{ color: 'var(--second-text-color)' }}>
                Here are your 20 most recent LeetCode submissions.
            </span>

            {/* Handle no username case */}
            {!username ? (
                <Nolinked message={"Please add you leetcode UserName to show your recent submissions"} />
            ) : (
                <>
                    {/* Loading state with skeleton */}
                    {isLoading && <LoadingSkeleton />}

                    {/* Error state */}
                    {leetcodeError && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="bg-red-50 rounded-full p-4 mb-4">
                                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Error Loading Data</h3>
                            <p className="text-sm text-red-600 text-center">{leetcodeError}</p>
                        </div>
                    )}

                    {/* Success state with submissions */}
                    {!isLoading && !leetcodeError && (
                        <>
                            {submissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4">
                                    <div className="bg-gray-50 rounded-full p-4 mb-4">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Recent Submissions</h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        No recent submissions found for this username. Start solving problems to see your activity here!
                                    </p>
                                </div>
                            ) : (
                                <ul
                                    className="space-y-4 overflow-y-auto mt-4 pr-2"
                                    style={{ maxHeight: '560px' }}
                                >
                                    {submissions.map((submission, index) => (
                                        <SubmissionItem key={index} submission={submission} />
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

