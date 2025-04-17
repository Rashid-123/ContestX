"use client"
import { useState } from 'react';
import Head from 'next/head';
import { useContests } from '../../hooks/useContests';
import ContestCard from '../../components/ContestCard';
import FilterBar from '../../components/FilterBar';

export default function ContestsPage() {
    const {
        groupedContests,
        loading,
        error,
        filters,
        availablePlatforms,
        filterByPlatform,
        filterByStatus,
        clearFilters
    } = useContests();

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

    return (
        <>
            <Head>
                <title>Coding Contests | All Platforms</title>
                <meta name="description" content="Find all coding contests from various platforms in one place" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Coding Contests</h1>

                {/* Filters */}
                <FilterBar
                    availablePlatforms={availablePlatforms}
                    currentFilters={filters}
                    onFilterByPlatform={filterByPlatform}
                    onFilterByStatus={filterByStatus}
                    onClearFilters={clearFilters}
                />

                {/* Contest sections */}
                <div className="space-y-8">
                    {/* In filters.status mode, we only show the selected status */}
                    {filters.filterType === 'status' ? (
                        <>
                            {filters.status && groupedContests[filters.status].length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 capitalize">
                                        {filters.status} Contests
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedContests[filters.status].map(contest => (
                                            <ContestCard key={contest.code} contest={contest} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    ) : (
                        /* In all or platform filter mode, we show all statuses in order */
                        <>
                            {/* Ongoing Contests */}
                            {groupedContests.ongoing.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Ongoing Contests</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedContests.ongoing.map(contest => (
                                            <ContestCard key={contest.code} contest={contest} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Upcoming Contests */}
                            {groupedContests.upcoming.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Upcoming Contests</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedContests.upcoming.map(contest => (
                                            <ContestCard key={contest.code} contest={contest} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Past Contests */}
                            {groupedContests.past.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4">Past Contests</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedContests.past.map(contest => (
                                            <ContestCard key={contest.code} contest={contest} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {/* No contests message */}
                    {Object.values(groupedContests).every(group => group.length === 0) && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No contests found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}