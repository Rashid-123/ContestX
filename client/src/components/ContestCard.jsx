// // // components/ContestCard.js
// import { useState, useEffect } from 'react';
// import CountdownTimer from './CountdownTimer';
// import { parse, format, set } from 'date-fns';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { Calendar, Bookmark, ExternalLink } from 'lucide-react';

// export default function ContestCard({ contest, bookmarkedContests_Code, setBookmarkedContests_Code, token }) {
//     const [status, setStatus] = useState(contest.status);
//     const [currentTime, setCurrentTime] = useState(new Date());
//     // console.log("contest data in card", contest)
//     const [bookmarked, setBookmarked] = useState(false);
//     // Check for status transitions
//     useEffect(() => {
//         const interval = setInterval(() => {
//             const now = new Date();
//             setCurrentTime(now);

//             const startTime = new Date(contest.startime);
//             const endTime = new Date(contest.endtime);

//             if (status === 'upcoming' && now >= startTime) {
//                 setStatus('ongoing');
//             } else if (status === 'ongoing' && now >= endTime) {
//                 setStatus('past');
//             }
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [contest, status]);

//     const getStatusClass = () => {
//         switch (status) {
//             case 'ongoing': return 'bg-green-100 text-green-800';
//             case 'upcoming': return 'bg-blue-100 text-blue-800';
//             case 'past': return 'bg-gray-100 text-gray-800';
//             default: return '';
//         }
//     };

//     const getPlatformClass = () => {
//         switch (contest.platform.toLowerCase()) {
//             case 'codeforces': return 'bg-blue-100 text-blue-800';
//             case 'codechef': return 'bg-orange-100 text-orange-800';
//             case 'leetcode': return 'bg-red-100 text-red-800';
//             default: return '';
//         }
//     }

//     const getStatusText = () => {
//         switch (status) {
//             case 'ongoing': return 'Ongoing';
//             case 'upcoming': return 'Upcoming';
//             case 'past': return 'Past';
//             default: return '';
//         }
//     };

//     const getGoogleCalendarLink = () => {
//         const istTimeZone = 'Asia/Kolkata';

//         const start = format(new Date(contest.startime), "yyyyMMdd'T'HHmmss", { timeZone: istTimeZone });
//         const end = format(new Date(contest.endtime), "yyyyMMdd'T'HHmmss", { timeZone: istTimeZone });

//         const details = {
//             text: contest.name,
//             dates: `${start}/${end}`,
//             details: `Participate in ${contest.name} on ${contest.platform}`,
//             location: contest.platform,
//         };

//         const params = new URLSearchParams({
//             action: 'TEMPLATE',
//             ...details,
//         });

//         return `https://calendar.google.com/calendar/render?${params.toString()}`;
//     };


//     const getContestLink = () => {
//         switch (contest.platform.toLowerCase()) {
//             case 'codeforces':
//                 return `https://codeforces.com/contest/${contest.code}`;
//             case 'leetcode':
//                 return `https://leetcode.com/contest/${contest.code}`;
//             case 'codechef':
//                 return `https://www.codechef.com/${contest.code}`;
//             default:
//                 return '#';
//         }
//     };

//     const handleBookmark = async () => {

//         if (!token) {
//             toast.error("Please login to bookmark contests.");
//             return;
//         }

//         setBookmarked(!bookmarked);
//         try {
//             const response = await axios.post('http://localhost:5000/api/bookmark',
//                 { contestCode: contest.code }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`
//                 },
//                 withCredentials: true
//             },
//             )
//             console.log('Bookmark response:', response.data);
//             setBookmarkedContests_Code(response.data.bookmarks);

//         } catch (error) {
//             console.error('Error bookmarking contest:', error);
//         }

//     }
//     useEffect(() => {
//         if (bookmarkedContests_Code?.includes(contest.code)) {
//             setBookmarked(true);
//         }
//     }, [bookmarkedContests_Code, contest.code]);

//     return (
//         <div className="border rounded-lg p-4 shadow-sm bg-white">
//             <div className="flex justify-between items-start mb-2">


//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformClass()}`}>
//                     {contest.platform}
//                 </span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
//                     {contest.type}
//                 </span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
//                     {getStatusText()}
//                 </span>

//             </div>
//             <h3 className="font-medium text-lg">{contest.name}</h3>

//             <div className="text-sm mb-2">
//                 <p>{contest.formattedStartTime}</p>
//                 <p>Duration: {contest.duration} minutes</p>
//             </div>

//             <div className="mt-3">
//                 {status === 'upcoming' && (
//                     <CountdownTimer targetTime={contest.startime} type="start" />
//                 )}
//                 {status === 'ongoing' && (
//                     <CountdownTimer targetTime={contest.endtime} type="end" />
//                 )}
//             </div>
//             <div className="mt-4 flex gap-2">
//                 {status != 'past' && <a
//                     href={getGoogleCalendarLink()}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
//                 >
//                     <Calendar size={20} />                </a>}
//                 <a
//                     href={getContestLink()}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
//                 >
//                     <ExternalLink className="h-4 w-4" />
//                 </a>
//                 {/* <button
//     onClick={handleBookmark}
//     className={`px-3 py-1 text-sm rounded transition ${bookmarked
//         ? 'bg-yellow-400 text-white hover:bg-yellow-500'
//         : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//         }`}
// >
//     {/* {bookmarked ? 'Bookmarked' : 'Bookmark'} */}
//                 {/* <Bookmark size={20} />
// </button> */}
//                 <button onClick={handleBookmark}>
//                     <Bookmark
//                         size={20}
//                         className={`transition-colors ${bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'
//                             }`}
//                     />
//                 </button>
//             </div>

//         </div>
//     );
// }





import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, Bookmark, ExternalLink, Clock, Hourglass } from 'lucide-react';
import { SiCodeforces, SiCodechef, SiLeetcode } from "react-icons/si";

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ContestCard({ contest, bookmarkedContests_Code, setBookmarkedContests_Code, token }) {
    const [status, setStatus] = useState(contest.status);
    const [currentTime, setCurrentTime] = useState(new Date());
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
            case 'ongoing': return 'text-green-800 border border-green-200';
            case 'upcoming': return 'text-blue-800 border border-blue-200';
            case 'past': return 'text-red-500 border border-red-200';
            default: return '';
        }
    };

    const getPlatformClass = () => {
        switch (contest.platform.toLowerCase()) {
            case 'codeforces': return 'bg-blue-100 text-gray-700';
            case 'codechef': return 'bg-orange-100 text-gray-700';
            case 'leetcode': return 'bg-yellow-100 text-gray-700';
            default: return '';
        }
    }

    const getPlatformIcon = () => {
        switch (contest.platform.toLowerCase()) {
            case 'codeforces':
                return <SiCodeforces className="w-4 h-4 mr-1" />;
            case 'codechef':
                return <SiCodechef className="w-4 h-4 mr-1" />;
            case 'leetcode':
                return <SiLeetcode className="w-4 h-4 mr-1" />;
            default:
                return null;
        }
    };


    const getPlatformBorderClass = () => {
        switch (contest.platform.toLowerCase()) {
            case 'codeforces':
                return 'border-blue-100 hover:border-blue-300';
            case 'leetcode':
                return 'border-yellow-100 hover:border-yellow-300';
            case 'codechef':
                return 'border-orange-100 hover:border-orange-300';
            default:
                return 'border-gray-100 hover:border-gray-300';
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
            const response = await axios.post(
                'http://localhost:5000/api/bookmark',
                { contestCode: contest.code },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            setBookmarkedContests_Code(response.data.bookmarks);
        } catch (error) {
            console.error('Error bookmarking contest:', error);
        }
    };

    useEffect(() => {
        if (bookmarkedContests_Code?.includes(contest.code)) {
            setBookmarked(true);
        }
    }, [bookmarkedContests_Code, contest.code]);

    return (
        <Card className={` w-full ${getPlatformBorderClass()} hover:${getPlatformBorderClass()}`}>
            <CardHeader>
                <div className="flex justify-between items-center gap-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getPlatformClass()}`}>
                        {getPlatformIcon()}
                        {contest.platform}
                    </span>

                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {contest.type}
                    </span>

                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusClass()}`}>
                        {getStatusText()}
                    </span>
                </div>
                <h4 className="font-semibold text-lg mb-0">{contest.name}</h4>
            </CardHeader>



            <div className="px-6">
                <p className="flex items-center gap-2 text-blue-400">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>{contest.formattedStartTime}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-800">
                    <Hourglass className="h-4 w-4 text-gray-600" />
                    <span>Duration : {contest.duration} minutes</span>
                </p>
                <div className="mt-1">
                    {status === 'upcoming' && (
                        <CountdownTimer targetTime={contest.startime} type="start" />
                    )}
                    {status === 'ongoing' && (
                        <CountdownTimer targetTime={contest.endtime} type="end" />
                    )}
                </div>
            </div>

            <CardFooter >
                <div className="flex gap-2">
                    <TooltipProvider className="flex justify-between gap-2">
                        {status !== 'past' && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-9 w-9"
                                        asChild
                                    >
                                        <a
                                            href={getGoogleCalendarLink()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Calendar className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add to Calendar</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-9 w-9"
                                    asChild
                                >
                                    <a
                                        href={getContestLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Go to Contest</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-9 w-9"
                                    onClick={handleBookmark}
                                >
                                    <Bookmark
                                        className={`h-4 w-4 ${bookmarked ? "fill-current text-yellow-500" : ""
                                            }`}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{bookmarked ? 'Remove Bookmark' : 'Bookmark Contest'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardFooter>




        </Card >
    );

}