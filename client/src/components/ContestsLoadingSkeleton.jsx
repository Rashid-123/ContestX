import React from 'react';

// Individual Contest Card Skeleton
const ContestCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-6 border animate-pulse">
        {/* Contest Title */}
        <div className="h-6 bg-gray-200 rounded mb-3"></div>

        {/* Platform Badge */}
        <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>

        {/* Contest Details */}
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
            <div className="h-4 bg-gray-200 rounded w-36"></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
        </div>
    </div>
);

// Filter Bar Skeleton
const FilterBarSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
        {/* Filter Title */}
        <div className="h-6 bg-gray-200 rounded mb-4"></div>

        {/* Bookmark Button */}
        <div className="h-10 bg-gray-200 rounded mb-6"></div>

        {/* Status and platfrom  Filters */}
        <div className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
            </div>
        </div>

        {/* Clear Button */}
        <div className="h-10 bg-gray-200 rounded"></div>
    </div>
);

// Main Loading Skeleton Component
const ContestsLoadingSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Title */}
            <div className="h-9 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Desktop Sidebar Skeleton - Hidden on mobile */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-20">
                        <FilterBarSkeleton />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>

                    {/* Ongoing Contests Section */}
                    <section className="mb-8">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <ContestCardSkeleton key={`ongoing-${index}`} />
                            ))}
                        </div>
                    </section>

                    {/* Upcoming Contests Section */}
                    <section className="mb-8">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <ContestCardSkeleton key={`upcoming-${index}`} />
                            ))}
                        </div>
                    </section>

                    {/* Past Contests Section */}
                    <section>
                        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <ContestCardSkeleton key={`past-${index}`} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContestsLoadingSkeleton;