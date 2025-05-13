// // components/FilterBar.js
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// export default function FilterBar({
//     availablePlatforms,
//     currentFilters,
//     onFilterByPlatform,
//     onFilterByStatus,
//     onClearFilters,
//     onToggleBookmark,
//     isBookmarkActive,
//     token,
// }) {
//     const [activeTab, setActiveTab] = useState('platform'); // 'platform' or 'status'

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//     };

//     const handleBookmarkClick = () => {
//         if (!token) {
//             toast.error("Please login to show Bookmarks");
//             return
//         }
//         onClearFilters();
//         onToggleBookmark();
//     };

//     return (
//         <div className="mb-8 bg-gray-50 p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Filters</h2>

//             {/* Filter Tabs */}
//             <div className="flex border-b mb-4">
//                 <button
//                     onClick={() => handleTabChange('platform')}
//                     className={`mr-4 py-2 px-4 font-medium ${activeTab === 'platform'
//                         ? 'border-b-2 border-blue-500 text-blue-600'
//                         : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                 >
//                     Platform
//                 </button>
//                 <button
//                     onClick={() => handleTabChange('status')}
//                     className={`py-2 px-4 font-medium ${activeTab === 'status'
//                         ? 'border-b-2 border-blue-500 text-blue-600'
//                         : 'text-gray-500 hover:text-gray-700'
//                         }`}
//                 >
//                     Status
//                 </button>
//             </div>

//             {/* Platform Filters */}
//             {activeTab === 'platform' && (
//                 <div className="flex flex-wrap gap-2">
//                     {availablePlatforms.map(platform => (
//                         <button
//                             key={platform}
//                             onClick={() => onFilterByPlatform(platform)}
//                             className={`px-3 py-1 rounded-full text-sm ${currentFilters.platform === platform && currentFilters.filterType === 'platform'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
//                                 }`}
//                         >
//                             {platform}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* Status Filters */}
//             {activeTab === 'status' && (
//                 <div className="flex flex-wrap gap-2">
//                     {['ongoing', 'upcoming', 'past'].map(status => (
//                         <button
//                             key={status}
//                             onClick={() => onFilterByStatus(status)}
//                             className={`px-3 py-1 rounded-full text-sm ${currentFilters.status === status && currentFilters.filterType === 'status'
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
//                                 }`}
//                         >
//                             {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {/* Clear Filters */}
//             {(currentFilters.platform || currentFilters.status) && (
//                 <button
//                     onClick={onClearFilters}
//                     className="mt-4 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
//                 >
//                     Clear Filters
//                 </button>
//             )}

//             {<div className="mb-4">
//                 <button
//                     onClick={handleBookmarkClick}
//                     className={`px-3 py-1 rounded-full text-sm ${isBookmarkActive
//                         ? 'bg-yellow-500 text-white'
//                         : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
//                         }`}
//                 >
//                     {isBookmarkActive ? 'Show All' : 'Bookmarked'}
//                 </button>
//             </div>}
//         </div>
//     );
// }


"use client"
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Bookmark, Clock, History } from "lucide-react";

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
    const [activeTab, setActiveTab] = useState('platform');

    const handleBookmarkClick = () => {
        if (!token) {
            toast.error("Please login to show Bookmarks");
            return;
        }
        onToggleBookmark();
    };

    return (
        <Card className="border border-gray-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Filters</CardTitle>

                {/* Bookmark Filter Button */}
                <Button
                    variant={isBookmarkActive ? "default" : "outline"}
                    className={`w-full flex items-center justify-center gap-2 mt-3 ${isBookmarkActive ? "bg-yellow-500 hover:bg-yellow-600" : ""
                        }`}
                    onClick={handleBookmarkClick}
                >
                    <Bookmark className="h-4 w-4" />
                    {isBookmarkActive ? "Show All" : "Bookmarked"}
                </Button>
            </CardHeader>

            <CardContent className="pb-6 pt-0">
                {/* Tabs for Platform/Status */}
                <Tabs defaultValue="platform" onValueChange={setActiveTab} value={activeTab}>
                    <TabsList className="w-full">
                        <TabsTrigger value="platform" className="flex-1">Platform</TabsTrigger>
                        <TabsTrigger value="status" className="flex-1">Status</TabsTrigger>
                    </TabsList>

                    {/* Platform Filters */}
                    <TabsContent value="platform" className="mt-4">
                        <div className="flex flex-col gap-2">
                            {availablePlatforms.map(platform => (
                                <Button
                                    key={platform}
                                    variant={currentFilters.platform === platform && currentFilters.filterType === 'platform'
                                        ? "default"
                                        : "outline"}
                                    size="sm"
                                    className="justify-start"
                                    onClick={() => onFilterByPlatform(platform)}
                                >
                                    {platform}
                                </Button>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Status Filters */}
                    <TabsContent value="status" className="mt-4">
                        <div className="flex flex-col gap-2">
                            <Button
                                variant={currentFilters.status === 'ongoing' && currentFilters.filterType === 'status'
                                    ? "default"
                                    : "outline"}
                                size="sm"
                                className="justify-start"
                                onClick={() => onFilterByStatus('ongoing')}
                            >
                                <BadgeCheck className="h-4 w-4 mr-2" />
                                Ongoing
                            </Button>
                            <Button
                                variant={currentFilters.status === 'upcoming' && currentFilters.filterType === 'status'
                                    ? "default"
                                    : "outline"}
                                size="sm"
                                className="justify-start"
                                onClick={() => onFilterByStatus('upcoming')}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Upcoming
                            </Button>
                            <Button
                                variant={currentFilters.status === 'past' && currentFilters.filterType === 'status'
                                    ? "default"
                                    : "outline"}
                                size="sm"
                                className="justify-start"
                                onClick={() => onFilterByStatus('past')}
                            >
                                <History className="h-4 w-4 mr-2" />
                                Past
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Clear Filters */}
                {(currentFilters.platform || currentFilters.status) && (
                    <Button
                        variant="ghost"
                        className="w-full mt-4"
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}