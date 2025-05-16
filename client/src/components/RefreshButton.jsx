
'use client';

import { useState } from 'react';
import { useLeetCode } from '@/context/LeetCodeContext';
import { RefreshCw } from 'lucide-react';

export default function RefreshButton() {
    const { refreshData, isLoading, lastFetchTime } = useLeetCode();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshData(); // This will now force a fresh data fetch

        // Keep the refreshing state visible for at least 500ms for better UX
        setTimeout(() => setIsRefreshing(false), 500);
    };

    // Format the last fetch time
    const getLastFetchedText = () => {
        if (!lastFetchTime) return 'Never fetched';

        const lastFetch = new Date(lastFetchTime);
        const now = new Date();
        const diffMinutes = Math.floor((now - lastFetch) / (60 * 1000));

        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        } else {
            const diffHours = Math.floor(diffMinutes / 60);
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm ${isLoading || isRefreshing
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-400 hover:shadow'
                    }`}
                aria-label="Refresh data"
            >
                {isLoading || isRefreshing ? (
                    <>
                        <svg className="animate-spin h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-xs sm:text-sm">Refreshing</span>
                    </>
                ) : (
                    <>
                        <RefreshCw size={14} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline text-sm">Refresh Data</span>
                        <span className="sm:hidden text-xs">Refresh</span>
                    </>
                )}
            </button>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                Last: <span className="font-medium sm:hidden">{getLastFetchedText()}</span>
                <span className="font-medium hidden sm:inline">{getLastFetchedText()}</span>
            </span>
        </div>
    );
}