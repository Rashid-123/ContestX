

'use client';

import React, { useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { fromUnixTime, format, subMonths } from 'date-fns';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useLeetCode } from '@/context/LeetcodeContext';
const LeetCodeHeatmap = ({ username }) => {
    const { calendarData: heatmapData, isLoading, error, fetchLeetCodeData } = useLeetCode();

    useEffect(() => {
        if (username) {
            fetchLeetCodeData(username);
        }
    }, [username, fetchLeetCodeData]);

    // Calculate date range based on available data or default to current year
    const today = new Date();
    const defaultStartDate = format(subMonths(today, 12), 'yyyy-MM-dd');
    const defaultEndDate = format(today, 'yyyy-MM-dd');

    let startDate = defaultStartDate;
    let endDate = defaultEndDate;

    if (heatmapData.length > 0) {
        // Sort data by date
        const sortedData = [...heatmapData].sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        // Use first and last data points to determine range
        startDate = sortedData[0].date;
        endDate = sortedData[sortedData.length - 1].date;
    }

    const legendColors = [
        { color: 'bg-gray-200', label: 'None' },
        { color: 'bg-blue-300', label: '1-4' },
        { color: 'bg-blue-500', label: '5-9' },
        { color: 'bg-blue-700', label: '10-19' },
        { color: 'bg-blue-900', label: '20+' },
    ];

    if (isLoading) {
        return (
            <div className="p-4 rounded-2xl bg-white shadow-md">
                <h2 className="text-xl font-semibold mb-6 mt-5">Loading LeetCode data...</h2>
                <div className="h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-2xl bg-white border border-gray-200 ">
            <h2 className="text-xl font-semibold mb-6 mt-5">
                LeetCode Submissions for {username}
            </h2>

            {error ? (
                <div className="text-red-500 p-4">{error}</div>
            ) : heatmapData.length === 0 ? (
                <div className="p-4 text-gray-500">No submission data available</div>
            ) : (
                <>
                    <CalendarHeatmap
                        startDate={startDate}
                        endDate={endDate}
                        values={heatmapData}
                        classForValue={(value) => {
                            let base = 'cursor-pointer transition-all rounded-sm hover:stroke-black hover:stroke-2';
                            if (!value || !value.count) return `${base} fill-gray-200`;
                            if (value.count >= 20) return `${base} fill-blue-900`;
                            if (value.count >= 10) return `${base} fill-blue-700`;
                            if (value.count >= 5) return `${base} fill-blue-500`;
                            if (value.count >= 1) return `${base} fill-blue-300`;
                            return `${base} fill-gray-200`;
                        }}
                        gutterSize={3}
                        tooltipDataAttrs={(value) =>
                            value?.date
                                ? {
                                    'data-tooltip-id': 'leetcode-heatmap-tooltip',
                                    'data-tooltip-content': `${value.date}: ${value.count} submission${value.count !== 1 ? 's' : ''}`,
                                }
                                : {}
                        }
                        showWeekdayLabels
                    />

                    <ReactTooltip id="leetcode-heatmap-tooltip" place="top" className="z-50" />

                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                        <span>Less</span>
                        {legendColors.map((item, idx) => (
                            <div
                                key={idx}
                                className={`w-4 h-4 ${item.color} rounded-sm border border-gray-300`}
                                title={item.label}
                            />
                        ))}
                        <span>More</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default LeetCodeHeatmap;