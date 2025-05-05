"use client";
import { useEffect, useState } from 'react';

export default function Leetcode_activity({ username }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch('/api/leetcode/submissions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, count: 30 }),
                });

                if (!res.ok) throw new Error('API request failed');

                const data = await res.json();
                setSubmissions(data);
            } catch (error) {
                console.error('Failed to fetch recent submissions:', error);
                setError(error.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchSubmissions();
        }
    }, [username]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Recent LeetCode Submissions</h2>
            <ul>
                {submissions.map((submission, index) => {
                    const submissionDate = new Date(Number(submission.submissionTime) * 1000).toLocaleString();
                    const problemLink = `https://leetcode.com/problems/${submission.titleSlug}`;

                    return (
                        <li key={index} style={{ marginBottom: '1em' }}>
                            <a href={problemLink} target="_blank" rel="noopener noreferrer">
                                <strong>{submission.title}</strong>
                            </a>{' '}
                            (#{submission.number})<br />
                            Status: {submission.status}<br />
                            Language: {submission.lang}<br />
                            Difficulty: {submission.difficulty}<br />
                            Submitted at: {submissionDate}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
