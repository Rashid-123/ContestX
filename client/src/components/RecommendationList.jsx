// components/RecommendationList.jsx
import RecommendationCard from "./RecommendationCard";

export default function RecommendationList({ recommendations }) {
    // RecommendationList now expects to always receive data (or an empty array)
    // It no longer handles the 'user not logged in' state.

    if (recommendations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] rounded-lg p-8">
                <p className="text-gray-500 mb-4">No recommendations found</p>
                <p className="text-gray-400 text-center">
                    Seems like you have no recommendations yet. Create your first one below!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
        </div>
    );
}


