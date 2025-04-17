// components/ContestCard.js
import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';

export default function ContestCard({ contest }) {
    const [status, setStatus] = useState(contest.status);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Check for status transitions
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            const startTime = new Date(contest.startime);
            const endTime = new Date(contest.endtime);

            if (status === 'upcoming' && now >= startTime) {
                setStatus('ongoing');
            } else if (status === 'ongoing' && now >= endTime) {
                setStatus('past');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [contest, status]);

    const getStatusClass = () => {
        switch (status) {
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'past': return 'bg-gray-100 text-gray-800';
            default: return '';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'ongoing': return 'Ongoing';
            case 'upcoming': return 'Upcoming';
            case 'past': return 'Past';
            default: return '';
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{contest.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
                    {getStatusText()}
                </span>
            </div>

            <div className="text-sm text-gray-500 mb-2">
                <p>Platform: {contest.platform}</p>
                <p>Type: {contest.type}</p>
            </div>

            <div className="text-sm mb-2">
                <p>Start: {contest.formattedStartTime}</p>
                <p>End: {contest.formattedEndTime}</p>
                <p>Duration: {contest.duration} minutes</p>
            </div>

            <div className="mt-3">
                {status === 'upcoming' && (
                    <CountdownTimer targetTime={contest.startime} type="start" />
                )}
                {status === 'ongoing' && (
                    <CountdownTimer targetTime={contest.endtime} type="end" />
                )}
                {status === 'past' && (
                    <div className="text-gray-600 font-medium">Completed</div>
                )}
            </div>
        </div>
    );
}