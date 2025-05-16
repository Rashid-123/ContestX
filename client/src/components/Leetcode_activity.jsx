


'use client';

import { useEffect } from 'react';
import { useLeetCode } from '@/context/LeetCodeContext';
export default function LeetCode_activity({ username }) {
    const { submissions, isLoading, error, fetchLeetCodeData } = useLeetCode();

    useEffect(() => {
        if (username) {
            fetchLeetCodeData(username);
        }
    }, [username, fetchLeetCodeData]);
    console.log(submissions, "submissions")

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-4 rounded-2xl bg-white border border-gray-200  mt-4">
            <h2 className="text-xl font-semibold mb-4">Recent LeetCode Submissions</h2>
            {submissions.length === 0 ? (
                <p>No recent submissions found</p>
            ) : (
                <ul className="space-y-4">
                    {submissions.map((submission, index) => {
                        const submissionDate = new Date(Number(submission.submissionTime) * 1000).toLocaleString();
                        const problemLink = `https://leetcode.com/problems/${submission.titleSlug}`;

                        return (
                            <li key={index} className="p-3 border border-gray-200 rounded">
                                <a
                                    href={problemLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <strong>{submission.title}</strong>
                                </a>{' '}
                                (#{submission.number})
                                <div className="text-sm text-gray-600 mt-1">
                                    <div>Status: <span className={`font-medium ${submission.status === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>{submission.status}</span></div>
                                    <div>Language: {submission.lang}</div>
                                    <div>Difficulty: {submission.difficulty}</div>
                                    <div>Submitted at: {submissionDate}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}