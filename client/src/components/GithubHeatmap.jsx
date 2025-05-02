// "use client";

// import React from "react";
// import CalendarHeatmap from "react-calendar-heatmap";
// import { Tooltip as ReactTooltip } from "react-tooltip";

// const GithubHeatmap = ({ contributions }) => {
//     const flatData = contributions.flat();

//     const heatmapData = flatData.map((entry) => ({
//         date: entry.date,
//         count: entry.contributionCount,
//     }));

//     const startDate = heatmapData[0]?.date || "2024-01-01";
//     const endDate = heatmapData[heatmapData.length - 1]?.date || "2024-12-31";

//     return (
//         <div className="p-4 rounded-2xl bg-white shadow-md">
//             <h2 className="text-xl font-semibold mb-4">GitHub Contributions</h2>
//             <CalendarHeatmap
//                 startDate={startDate}
//                 endDate={endDate}
//                 values={heatmapData}
//                 classForValue={(value) => {
//                     if (!value || !value.count) return "fill-gray-200";
//                     if (value.count >= 20) return "fill-green-900";
//                     if (value.count >= 10) return "fill-green-700";
//                     if (value.count >= 5) return "fill-green-500";
//                     if (value.count >= 1) return "fill-green-300";
//                     return "fill-gray-200";
//                 }}
//                 gutterSize={3}
//                 tooltipDataAttrs={(value) =>
//                     value?.date
//                         ? { "data-tip": `${value.date}: ${value.count} contributions` }
//                         : {}
//                 }
//                 showWeekdayLabels
//             />
//             <ReactTooltip />
//         </div>
//     );
// };

// export default GithubHeatmap;



// "use client";

// import React, { useState } from "react";
// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css";
// import { Tooltip as ReactTooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";

// const GithubHeatmap = ({ contributions }) => {
//     const [selectedData, setSelectedData] = useState(null);

//     const flatData = contributions.flat();

//     const heatmapData = flatData.map((entry) => ({
//         date: entry.date,
//         count: entry.contributionCount,
//     }));

//     const startDate = heatmapData[0]?.date || "2024-01-01";
//     const endDate = heatmapData[heatmapData.length - 1]?.date || "2024-12-31";

//     const legendColors = [
//         { color: "bg-gray-200", label: "None" },
//         { color: "bg-green-300", label: "Low" },
//         { color: "bg-green-500", label: "Medium" },
//         { color: "bg-green-700", label: "High" },
//         { color: "bg-green-900", label: "Very High" },
//     ];

//     return (
//         <div className="p-4 rounded-2xl bg-white shadow-md">
//             <h2 className="text-xl font-semibold mb-4">GitHub Contributions</h2>

//             <CalendarHeatmap
//                 startDate={startDate}
//                 endDate={endDate}
//                 values={heatmapData}
//                 classForValue={(value) => {
//                     if (!value || !value.count) return "fill-gray-200";
//                     if (value.count >= 20) return "fill-green-900";
//                     if (value.count >= 10) return "fill-green-700";
//                     if (value.count >= 5) return "fill-green-500";
//                     if (value.count >= 1) return "fill-green-300";
//                     return "fill-gray-200";
//                 }}
//                 gutterSize={3}
//                 tooltipDataAttrs={(value) =>
//                     value?.date
//                         ? { "data-tip": `${value.date}: ${value.count} contributions` }
//                         : {}
//                 }
//                 showWeekdayLabels
//                 onClick={(value) => {
//                     if (value?.date) setSelectedData(value);
//                 }}
//             />
//             <ReactTooltip />

//             {selectedData && (
//                 <div className="mt-4 p-4 border rounded-lg bg-gray-100">
//                     <p className="text-gray-800">
//                         📅 <strong>Date:</strong> {selectedData.date}
//                     </p>
//                     <p className="text-gray-800">
//                         🟢 <strong>Contributions:</strong> {selectedData.count}
//                     </p>
//                 </div>
//             )}

//             {/* Legend */}
//             <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
//                 <span>Less</span>
//                 {legendColors.map((item, idx) => (
//                     <div
//                         key={idx}
//                         className={`w-4 h-4 ${item.color} rounded-sm border border-gray-300`}
//                         title={item.label}
//                     />
//                 ))}
//                 <span>More</span>
//             </div>
//         </div>
//     );
// };

// export default GithubHeatmap;


"use client";

import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const GithubHeatmap = ({ contributions }) => {
    const flatData = contributions.flat();

    const heatmapData = flatData.map((entry) => ({
        date: entry.date,
        count: entry.contributionCount,
    }));

    const startDate = heatmapData[0]?.date || "2024-01-01";
    const endDate = heatmapData[heatmapData.length - 1]?.date || "2024-12-31";

    const legendColors = [
        { color: "bg-gray-200", label: "None" },
        { color: "bg-green-300", label: "Low" },
        { color: "bg-green-500", label: "Medium" },
        { color: "bg-green-700", label: "High" },
        { color: "bg-green-900", label: "Very High" },
    ];

    return (
        <div className="p-4 rounded-2xl bg-white shadow-md ">
            <h2 className="text-xl font-semibold mb-6 mt-5">GitHub Contributions</h2>

            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={heatmapData}
                classForValue={(value) => {
                    let base = "cursor-pointer transition-all rounded-sm hover:stroke-black hover:stroke-2";
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
                        ? { "data-tooltip-id": "github-heatmap-tooltip", "data-tooltip-content": `${value.date} : ${value.count} contributions` }
                        : {}
                }
                showWeekdayLabels
            />
            <ReactTooltip id="github-heatmap-tooltip" place="top" className="z-50" />


            <div className="flex items-center gap-2 text-sm text-gray-600">
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
        </div>
    );
};

export default GithubHeatmap;
