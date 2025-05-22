
'use client';
import { useEffect } from 'react';
import { useLeetCode } from '@/context/LeetCodeContext';
import SubmissionItem from '@/components/SubmissionItem';

export default function LeetCode_activity({ username }) {
    const { submissions, isLoading, leetcodeError, fetchLeetCodeData } = useLeetCode();

    useEffect(() => {
        if (username) {
            fetchLeetCodeData(username);
        }
    }, [username, fetchLeetCodeData]);

    if (isLoading) return <p>Loading...</p>;
    if (leetcodeError) return <p>Error: {leetcodeError}</p>;

    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold">Recent LeetCode Submissions</h2>
            <span className=" text-xs sm:text-sm" style={{ color: 'var(--second-text-color)' }}>Here are your 20 most recent LeetCode submissions.</span>

            {submissions.length === 0 ? (
                <p>No recent submissions found</p>
            ) : (
                <ul
                    className="space-y-4 overflow-y-auto mt-4 pr-2 "
                    style={{ maxHeight: '450px' }}
                >
                    {submissions.map((submission, index) => (
                        <SubmissionItem key={index} submission={submission} />
                    ))}
                </ul>
            )}
        </div>
    );
}

