// components/RecommendationListSkeleton.jsx
export default function RecommendationListSkeleton() {
    const skeletons = Array(6).fill(null); // Number of skeleton cards to render

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-md shadow-xs border border-blue-100 animate-pulse p-6"
                >
                    {/* Title */}
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-400 mb-6">
                        <div className="h-4 w-4 bg-gray-300 rounded-full mr-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>

                    {/* Problem count badge */}
                    <div className="h-6 bg-gray-200 rounded-full w-1/3 mb-6" />

                    {/* Button */}
                    <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
            ))}
        </div>
    );
}
