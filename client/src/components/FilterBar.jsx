
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
import { BadgeCheck, Clock, History, Bookmark, Code, Terminal, Cpu } from "lucide-react";
import { SiCodeforces, SiCodechef, SiLeetcode } from "react-icons/si";

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

    // Platform icons mapping
    const getPlatformIcon = (platform) => {
        const platformLower = platform.toLowerCase();
        if (platformLower.includes('codechef')) return <SiCodechef className="h-4 w-4 mr-2" />;
        if (platformLower.includes('codeforces')) return <SiCodeforces className="h-4 w-4 mr-2" />;
        if (platformLower.includes('leetcode')) return <SiLeetcode className="h-4 w-4 mr-2" />;
        return <Code className="h-4 w-4 mr-2" />; // Default icon
    };

    // Get platform button styles based on whether it's active
    const getPlatformButtonStyle = (platform) => {
        const isActive = currentFilters.platform === platform && currentFilters.filterType === 'platform';

        // Base styles
        let styles = "justify-start text-gray-700 ";

        if (isActive) {
            const platformLower = platform.toLowerCase();
            if (platformLower.includes('codechef')) return styles + "bg-orange-100 hover:bg-orange-200 border-orange-300";
            if (platformLower.includes('codeforces')) return styles + "bg-blue-100 hover:bg-blue-200 border-blue-300";
            if (platformLower.includes('leetcode')) return styles + "bg-yellow-100 hover:bg-yellow-200 border-yellow-300";
            return styles + "bg-purple-100 hover:bg-purple-200 border-purple-300";
        } else {
            const platformLower = platform.toLowerCase();
            if (platformLower.includes('codechef')) return styles + "hover:bg-orange-200 border-orange-200";
            if (platformLower.includes('codeforces')) return styles + "hover:bg-blue-200 border-blue-200";
            if (platformLower.includes('leetcode')) return styles + "hover:bg-yellow-200 border-yellow-200";
            return styles + "bg-purple-100 hover:bg-purple-200 border-purple-300";
        }

        return styles;
    };

    // Get status button styles
    const getStatusButtonStyle = (status) => {
        const isActive = currentFilters.status === status && currentFilters.filterType === 'status';

        // Base styles with gray text
        let styles = "justify-start ";

        if (isActive) {
            if (status === 'ongoing') return styles + "text-green-700 border border-green-200 bg-green-100 hover:bg-green-200";
            if (status === 'upcoming') return styles + "text-blue-700 border border-blue-200 bg-blue-100 hover:bg-blue-200";
            if (status === 'past') return styles + "text-red-400 border border-red-200 bg-red-100 hover:bg-red-200";
        } else {
            if (status === 'ongoing') return styles + "text-green-700 border border-green-200 hover:bg-green-100";
            if (status === 'upcoming') return styles + "text-blue-700 border border-blue-200 hover:bg-blue-100";
            if (status === 'past') return styles + "text-red-400 border border-red-200 hover:bg-red-100";
        }

        return styles;
    };

    return (
        <Card className="border border-gray-200 max-w-xs shadow-none">
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
                                    className={getPlatformButtonStyle(platform)}
                                    onClick={() => onFilterByPlatform(platform)}
                                >
                                    {getPlatformIcon(platform)}
                                    {platform}
                                </Button>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Status Filters */}
                    <TabsContent value="status" className="mt-4">
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={getStatusButtonStyle('ongoing')}
                                onClick={() => onFilterByStatus('ongoing')}
                            >
                                <BadgeCheck className="h-4 w-4 mr-2" />
                                Ongoing
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={getStatusButtonStyle('upcoming')}
                                onClick={() => onFilterByStatus('upcoming')}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Upcoming
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={getStatusButtonStyle('past')}
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
                        className="w-full mt-4 border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}