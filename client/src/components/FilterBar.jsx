// components/FilterBar.js
import { useState } from 'react';
import toast from 'react-hot-toast';
export default function FilterBar({
    availablePlatforms,
    currentFilters,
    onFilterByPlatform,
    onFilterByStatus,
    onClearFilters,
    onToggleBookmark,
    isBookmarkActive,
    token,
}) {
    const [activeTab, setActiveTab] = useState('platform'); // 'platform' or 'status'

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleBookmarkClick = () => {
        if (!token) {
            toast.error("Please login to show Bookmarks");
            return
        }
        onClearFilters();
        onToggleBookmark();
    };

    return (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            {/* Filter Tabs */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => handleTabChange('platform')}
                    className={`mr-4 py-2 px-4 font-medium ${activeTab === 'platform'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Platform
                </button>
                <button
                    onClick={() => handleTabChange('status')}
                    className={`py-2 px-4 font-medium ${activeTab === 'status'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Status
                </button>
            </div>

            {/* Platform Filters */}
            {activeTab === 'platform' && (
                <div className="flex flex-wrap gap-2">
                    {availablePlatforms.map(platform => (
                        <button
                            key={platform}
                            onClick={() => onFilterByPlatform(platform)}
                            className={`px-3 py-1 rounded-full text-sm ${currentFilters.platform === platform && currentFilters.filterType === 'platform'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                }`}
                        >
                            {platform}
                        </button>
                    ))}
                </div>
            )}

            {/* Status Filters */}
            {activeTab === 'status' && (
                <div className="flex flex-wrap gap-2">
                    {['ongoing', 'upcoming', 'past'].map(status => (
                        <button
                            key={status}
                            onClick={() => onFilterByStatus(status)}
                            className={`px-3 py-1 rounded-full text-sm ${currentFilters.status === status && currentFilters.filterType === 'status'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Clear Filters */}
            {(currentFilters.platform || currentFilters.status) && (
                <button
                    onClick={onClearFilters}
                    className="mt-4 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                >
                    Clear Filters
                </button>
            )}

            {<div className="mb-4">
                <button
                    onClick={handleBookmarkClick}
                    className={`px-3 py-1 rounded-full text-sm ${isBookmarkActive
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                >
                    {isBookmarkActive ? 'Show All' : 'Bookmarked'}
                </button>
            </div>}
        </div>
    );
}