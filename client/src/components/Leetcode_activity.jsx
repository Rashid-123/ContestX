// "use client";
// import { useEffect, useState } from 'react';

// export default function Leetcode_activity({ username }) {
//     const [submissions, setSubmissions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSubmissions = async () => {
//             try {
//                 const res = await fetch('/api/leetcode/submissions', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ username, count: 30 }),
//                 });

//                 if (!res.ok) throw new Error('API request failed');

//                 const data = await res.json();
//                 setSubmissions(data);
//             } catch (error) {
//                 console.error('Failed to fetch recent submissions:', error);
//                 setError(error.message || 'Unknown error');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (username) {
//             fetchSubmissions();
//         }
//     }, [username]);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div>
//             <h2>Recent LeetCode Submissions</h2>
//             <ul>
//                 {submissions.map((submission, index) => {
//                     const submissionDate = new Date(Number(submission.submissionTime) * 1000).toLocaleString();
//                     const problemLink = `https://leetcode.com/problems/${submission.titleSlug}`;

//                     return (
//                         <li key={index} style={{ marginBottom: '1em' }}>
//                             <a href={problemLink} target="_blank" rel="noopener noreferrer">
//                                 <strong>{submission.title}</strong>
//                             </a>{' '}
//                             (#{submission.number})<br />
//                             Status: {submission.status}<br />
//                             Language: {submission.lang}<br />
//                             Difficulty: {submission.difficulty}<br />
//                             Submitted at: {submissionDate}
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// }


'use client';

import { useEffect } from 'react';
import { useLeetCode } from '@/context/LeetcodeContext';
export default function Leetcode_activity({ username }) {
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
        <div className="p-4 rounded-2xl bg-white shadow-md mt-4">
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