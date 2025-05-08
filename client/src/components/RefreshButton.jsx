'use client';

import { useState } from 'react';
import { useLeetCode } from '@/context/LeetcodeContext';
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
        <div className="flex items-center space-x-2">
            <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className={`px-3 py-1 rounded-md text-sm transition-all ${isLoading || isRefreshing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
            >
                {isLoading || isRefreshing ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Refreshing...
                    </span>
                ) : (
                    'Refresh Data'
                )}
            </button>
            <span className="text-sm text-gray-500">
                Last updated: {getLastFetchedText()}
            </span>
        </div>
    );
}