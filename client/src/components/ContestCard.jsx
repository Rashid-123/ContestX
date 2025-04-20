// // components/ContestCard.js
import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import { parse, format, set } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ContestCard({ contest, bookmarkedContests_Code, setBookmarkedContests_Code, token }) {
    const [status, setStatus] = useState(contest.status);
    const [currentTime, setCurrentTime] = useState(new Date());
    console.log("contest data in card", contest)
    const [bookmarked, setBookmarked] = useState(false);
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

    const getGoogleCalendarLink = () => {
        const istTimeZone = 'Asia/Kolkata';

        const start = format(new Date(contest.startime), "yyyyMMdd'T'HHmmss", { timeZone: istTimeZone });
        const end = format(new Date(contest.endtime), "yyyyMMdd'T'HHmmss", { timeZone: istTimeZone });

        const details = {
            text: contest.name,
            dates: `${start}/${end}`,
            details: `Participate in ${contest.name} on ${contest.platform}`,
            location: contest.platform,
        };

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            ...details,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };


    const getContestLink = () => {
        switch (contest.platform.toLowerCase()) {
            case 'codeforces':
                return `https://codeforces.com/contest/${contest.code}`;
            case 'leetcode':
                return `https://leetcode.com/contest/${contest.code}`;
            case 'codechef':
                return `https://www.codechef.com/${contest.code}`;
            default:
                return '#';
        }
    };

    const handleBookmark = async () => {

        if (!token) {
            toast.error("Please login to bookmark contests.");
            return;
        }

        setBookmarked(!bookmarked);
        try {
            const response = await axios.post('http://localhost:5000/api/bookmark',
                { contestCode: contest.code }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            },
            )
            console.log('Bookmark response:', response.data);
            setBookmarkedContests_Code(response.data.bookmarks);

        } catch (error) {
            console.error('Error bookmarking contest:', error);
        }

    }
    useEffect(() => {
        if (bookmarkedContests_Code?.includes(contest.code)) {
            setBookmarked(true);
        }
    }, [bookmarkedContests_Code, contest.code]);

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
                {/* <p>End: {contest.formattedEndTime}</p> */}
                <p>Duration: {contest.duration} minutes</p>
            </div>

            <div className="mt-3">
                {status === 'upcoming' && (
                    <CountdownTimer targetTime={contest.startime} type="start" />
                )}
                {status === 'ongoing' && (
                    <CountdownTimer targetTime={contest.endtime} type="end" />
                )}
            </div>
            <div className="mt-4 flex gap-2">
                {status != 'past' && <a
                    href={getGoogleCalendarLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Add to Calendar
                </a>}
                <a
                    href={getContestLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                    Go to Contest
                </a>
                <button
                    onClick={handleBookmark}
                    className={`px-3 py-1 text-sm rounded transition ${bookmarked
                        ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>


            </div>
        </div>
    );
}

