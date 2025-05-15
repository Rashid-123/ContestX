// "use client"
// import { use, useState, useEffect } from 'react';
// import Head from 'next/head';
// import { useContests } from '../../hooks/useContests';
// import ContestCard from '../../components/ContestCard';
// import FilterBar from '../../components/FilterBar';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';
// export default function ContestsPage() {
//     const {
//         rawContests,
//         groupedContests,
//         loading,
//         error,
//         filters,
//         availablePlatforms,
//         filterByPlatform,
//         filterByStatus,
//         clearFilters
//     } = useContests();

//     const [isBookmarked, setIsBookmarked] = useState(false);
//     const [bookmarkedContests_Code, setBookmarkedContests_Code] = useState([]);
//     const [bookmarkedContests, setBookmarkedContests] = useState([]);
//     const { user, token } = useAuth();

//     useEffect(() => {
//         if (user) {
//             const fetchBookmarked = async () => {
//                 try {
//                     const response = await axios.get('http://localhost:5000/api/bookmark/', {
//                         headers: {
//                             'Content-Type': 'application/json',
//                             Authorization: `Bearer ${token}`
//                         }
//                     });
//                     setBookmarkedContests_Code(response.data.bookmarks);
//                     console.log('Bookmarked contests:', response.data.bookmarks);
//                 } catch (err) {
//                     console.error('Error fetching bookmarked contests:', err);
//                 }
//             };
//             fetchBookmarked();
//         }
//     }, [user]);

//     useEffect(() => {
//         if (rawContests?.length > 0 && bookmarkedContests_Code?.length > 0) {
//             const filtered = rawContests.filter(contest =>
//                 bookmarkedContests_Code.includes(contest.code)
//             );
//             setBookmarkedContests(filtered);
//         } else {
//             setBookmarkedContests([]);
//         }
//     }, [rawContests, bookmarkedContests_Code]);


//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                     <p>{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Head>
//                 <title>Coding Contests | All Platforms</title>
//                 <meta name="description" content="Find all coding contests from various platforms in one place" />
//             </Head>

//             <div className="container mx-auto px-4 py-8">
//                 <h1 className="text-3xl font-bold mb-6">Coding Contests</h1>

//                 {/* Filters */}
//                 <FilterBar
//                     availablePlatforms={availablePlatforms}
//                     currentFilters={filters}
//                     onFilterByPlatform={(platform) => {
//                         setIsBookmarked(false); // Clear bookmark
//                         filterByPlatform(platform);
//                     }}
//                     onFilterByStatus={(status) => {
//                         setIsBookmarked(false); // Clear bookmark
//                         filterByStatus(status);
//                     }}
//                     onClearFilters={() => {
//                         setIsBookmarked(false); // Clear bookmark
//                         clearFilters();
//                     }}
//                     onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
//                     isBookmarkActive={isBookmarked}
//                     token={token} // Pass token to FilterBar if needed
//                 />

//                 {/* Contest sections */}
//                 <div className="space-y-8">
//                     {/* Bookmarked Contests */}
//                     {isBookmarked && (
//                         <section>
//                             <h2 className="text-2xl font-semibold mb-4">Bookmarked Contests</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {bookmarkedContests?.length > 0 ? (
//                                     bookmarkedContests?.map(contest => (
//                                         <ContestCard key={contest.code} contest={contest} token={token} bookmarkedContests_Code={bookmarkedContests_Code}
//                                             setBookmarkedContests_Code={setBookmarkedContests_Code} />
//                                     ))
//                                 ) : (
//                                     <p className="text-gray-500">No bookmarked contests found.</p>
//                                 )}
//                             </div>
//                         </section>
//                     )}
//                     {/* In filters.status mode, we only show the selected status */}
//                     {!isBookmarked && (filters.filterType === 'status' ? (
//                         <>
//                             {filters.status && groupedContests[filters.status].length > 0 && (
//                                 <section>
//                                     <h2 className="text-2xl font-semibold mb-4 capitalize">
//                                         {filters.status} Contests
//                                     </h2>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {groupedContests[filters.status].map(contest => (
//                                             <ContestCard key={contest.code} contest={contest} token={token} bookmarkedContests_Code={bookmarkedContests_Code}
//                                                 setBookmarkedContests_Code={setBookmarkedContests_Code} />
//                                         ))}
//                                     </div>
//                                 </section>
//                             )}
//                         </>
//                     ) : (
//                         /* In all or platform filter mode, we show all statuses in order */
//                         <>
//                             {/* Ongoing Contests */}
//                             {groupedContests.ongoing.length > 0 && (
//                                 <section>
//                                     <h2 className="text-2xl font-semibold mb-4">Ongoing Contests</h2>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {groupedContests.ongoing.map(contest => (
//                                             <ContestCard key={contest.code} contest={contest} token={token} bookmarkedContests_Code={bookmarkedContests_Code}
//                                                 setBookmarkedContests_Code={setBookmarkedContests_Code} />
//                                         ))}
//                                     </div>
//                                 </section>
//                             )}

//                             {/* Upcoming Contests */}
//                             {groupedContests.upcoming.length > 0 && (
//                                 <section>
//                                     <h2 className="text-2xl font-semibold mb-4">Upcoming Contests</h2>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {groupedContests.upcoming.map(contest => (
//                                             <ContestCard key={contest.code} contest={contest} token={token} bookmarkedContests_Code={bookmarkedContests_Code}
//                                                 setBookmarkedContests_Code={setBookmarkedContests_Code} />
//                                         ))}
//                                     </div>
//                                 </section>
//                             )}

//                             {/* Past Contests */}
//                             {groupedContests.past.length > 0 && (
//                                 <section>
//                                     <h2 className="text-2xl font-semibold mb-4">Past Contests</h2>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {groupedContests.past.map(contest => (
//                                             <ContestCard key={contest.code} contest={contest} token={token} bookmarkedContests_Code={bookmarkedContests_Code}
//                                                 setBookmarkedContests_Code={setBookmarkedContests_Code} />
//                                         ))}
//                                     </div>
//                                 </section>
//                             )}
//                         </>
//                     ))}

//                     {/* No contests message */}
//                     {Object.values(groupedContests).every(group => group.length === 0) && (
//                         <div className="text-center py-12">
//                             <p className="text-gray-500">No contests found matching your filters.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }






"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useContests } from '../../hooks/useContests';
import ContestCard from '../../components/ContestCard';
import FilterBar from '@/components/FilterBar';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";

export default function ContestsPage() {
    const {
        rawContests,
        groupedContests,
        loading,
        error,
        filters,
        availablePlatforms,
        filterByPlatform,
        filterByStatus,
        clearFilters
    } = useContests();

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkedContests_Code, setBookmarkedContests_Code] = useState([]);
    const [bookmarkedContests, setBookmarkedContests] = useState([]);
    const { user, token } = useAuth();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchBookmarked = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/bookmark/', {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setBookmarkedContests_Code(response.data.bookmarks);
                } catch (err) {
                    console.error('Error fetching bookmarked contests:', err);
                }
            };
            fetchBookmarked();
        }
    }, [user, token]);

    useEffect(() => {
        if (rawContests?.length > 0 && bookmarkedContests_Code?.length > 0) {
            const filtered = rawContests.filter(contest =>
                bookmarkedContests_Code.includes(contest.code)
            );
            setBookmarkedContests(filtered);
        } else {
            setBookmarkedContests([]);
        }
    }, [rawContests, bookmarkedContests_Code]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Filter handlers
    const handleFilterByPlatform = (platform) => {
        setIsBookmarked(false);
        filterByPlatform(platform);
        setOpen(false); // Close mobile filter on selection
    };

    const handleFilterByStatus = (status) => {
        setIsBookmarked(false);
        filterByStatus(status);
        setOpen(false); // Close mobile filter on selection
    };

    const handleClearFilters = () => {
        setIsBookmarked(false);
        clearFilters();
    };

    const handleToggleBookmark = () => {
        if (!token) {
            toast.error("Please login to show Bookmarks");
            return;
        }
        setIsBookmarked(!isBookmarked);
        clearFilters();
        setOpen(false); // Close mobile filter on selection
    };

    // Render contests sections based on current filter
    const renderContests = () => {
        if (isBookmarked) {
            return (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Bookmarked Contests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
                        {bookmarkedContests?.length > 0 ? (
                            bookmarkedContests?.map(contest => (
                                <ContestCard
                                    key={contest.code}
                                    contest={contest}
                                    token={token}
                                    bookmarkedContests_Code={bookmarkedContests_Code}
                                    setBookmarkedContests_Code={setBookmarkedContests_Code}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No bookmarked contests found.</p>
                        )}
                    </div>
                </section>
            );
        }

        if (filters.filterType === 'status' && filters.status) {
            return (
                <section>
                    <h2 className="text-2xl font-semibold mb-4 capitalize">
                        {filters.status} Contests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
                        {groupedContests[filters.status].length > 0 ? (
                            groupedContests[filters.status].map(contest => (
                                <ContestCard
                                    key={contest.code}
                                    contest={contest}
                                    token={token}
                                    bookmarkedContests_Code={bookmarkedContests_Code}
                                    setBookmarkedContests_Code={setBookmarkedContests_Code}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No {filters.status} contests found.</p>
                        )}
                    </div>
                </section>
            );
        }

        return (
            <>
                {/* Ongoing Contests */}
                {groupedContests.ongoing.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Ongoing Contests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
                            {groupedContests.ongoing.map(contest => (
                                <ContestCard
                                    key={contest.code}
                                    contest={contest}
                                    token={token}
                                    bookmarkedContests_Code={bookmarkedContests_Code}
                                    setBookmarkedContests_Code={setBookmarkedContests_Code}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Contests */}
                {groupedContests.upcoming.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Upcoming Contests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
                            {groupedContests.upcoming.map(contest => (
                                <ContestCard
                                    key={contest.code}
                                    contest={contest}
                                    token={token}
                                    bookmarkedContests_Code={bookmarkedContests_Code}
                                    setBookmarkedContests_Code={setBookmarkedContests_Code}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Past Contests */}
                {groupedContests.past.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Past Contests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
                            {groupedContests.past.map(contest => (
                                <ContestCard
                                    key={contest.code}
                                    contest={contest}
                                    token={token}
                                    bookmarkedContests_Code={bookmarkedContests_Code}
                                    setBookmarkedContests_Code={setBookmarkedContests_Code}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* No contests message */}
                {Object.values(groupedContests).every(group => group.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No contests found matching your filters.</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            <Head>
                <title>Coding Contests | All Platforms</title>
                <meta name="description" content="Find all coding contests from various platforms in one place" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Coding Contests</h1>

                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <FilterIcon className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                            <div className="py-6">
                                <FilterBar
                                    availablePlatforms={availablePlatforms}
                                    currentFilters={filters}
                                    onFilterByPlatform={handleFilterByPlatform}
                                    onFilterByStatus={handleFilterByStatus}
                                    onClearFilters={handleClearFilters}
                                    onToggleBookmark={handleToggleBookmark}
                                    isBookmarkActive={isBookmarked}
                                    token={token}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar - Hidden on mobile */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-20">
                            <FilterBar
                                availablePlatforms={availablePlatforms}
                                currentFilters={filters}
                                onFilterByPlatform={handleFilterByPlatform}
                                onFilterByStatus={handleFilterByStatus}
                                onClearFilters={handleClearFilters}
                                onToggleBookmark={handleToggleBookmark}
                                isBookmarkActive={isBookmarked}
                                token={token}
                            />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {renderContests()}
                    </div>
                </div>
            </div>
        </>
    );
}