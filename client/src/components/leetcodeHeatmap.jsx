

'use client';
import React, { useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { fromUnixTime, format, subMonths } from 'date-fns';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useLeetCode } from '@/context/LeetCodeContext';
import Nolinked from './Nolinked';

const SkeletonLoader = () => {
    return (
        <div className="animate-pulse">
            {/* Calendar skeleton */}
            <div className="grid grid-cols-53 gap-1 mb-4">
                {Array.from({ length: 371 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 bg-green-200 rounded-sm"></div>
                ))}
            </div>

            {/* Legend skeleton */}
            <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                ))}
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};



const LeetCodeHeatmap = ({ username }) => {
    const { calendarData: heatmapData, isLoading, leetcodeError, fetchLeetCodeData } = useLeetCode();

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
        { color: 'bg-green-300', label: '1-4' },
        { color: 'bg-green-500', label: '5-9' },
        { color: 'bg-green-700', label: '10-19' },
        { color: 'bg-green-900', label: '20+' },
    ];

    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold">
                LeetCode Heatmap
            </h2>
            <span className="text-xs sm:text-sm" style={{ color: 'var(--second-text-color)' }}>
                Your coding progress on LeetCode
            </span>

            {/* Handle null/undefined username */}
            {!username ? (
                <div className="my-6">
                    <Nolinked message={"Please add you leetcode userName to show the heatmap"} />
                </div>
            ) : isLoading ? (
                <div className="my-6">
                    <SkeletonLoader />
                </div>
            ) : leetcodeError ? (
                <div className="my-6 flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
                    <p className="text-sm text-red-600">{leetcodeError}</p>
                </div>
            ) : heatmapData.length === 0 ? (
                <div className="my-6 flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                    <p className="text-sm text-gray-500">No submission data found for this account.</p>
                </div>
            ) : (
                <>
                    <div className='my-3'>
                        <CalendarHeatmap
                            startDate={startDate}
                            endDate={endDate}
                            values={heatmapData}
                            classForValue={(value) => {
                                let base = 'cursor-pointer transition-all rounded-sm hover:stroke-black hover:stroke-2';
                                if (!value || !value.count) return `${base} fill-gray-200`;
                                if (value.count >= 20) return `${base} fill-green-900`;
                                if (value.count >= 10) return `${base} fill-green-700`;
                                if (value.count >= 5) return `${base} fill-green-500`;
                                if (value.count >= 1) return `${base} fill-green-300`;
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
                    </div>

                    <ReactTooltip id="leetcode-heatmap-tooltip" place="top" className="z-50" />

                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <span>Less</span>
                        {legendColors.map((item, idx) => (
                            <div
                                key={idx}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${item.color} rounded-sm border border-gray-300`}
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