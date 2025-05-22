
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
export default function RecommendationCard({ recommendation }) {

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            return "Invalid date";
        }
    };

    return (
        <div key={recommendation.id} className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-shadow border border-blue-100">

            <Link href={`/recommendation/details/${recommendation.id}`}> <div className=" p-5">
                <h3 className="text-lg font-semibold text-gray-800">{recommendation.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{formatDate(recommendation.date)}</p>

                <div className="flex justify-between items-center mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {recommendation.count} problems
                    </span>
                </div>

                <div className="mt-4">
                    <button className="w-full flex items-center justify-center px-4 py-2 rounded bg-blue-400 hover:bg-blue-500 text-white font-medium transition-colors">
                        <span>Solve problems</span> <ArrowBigRight className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </div></Link>
        </div >
    );
}
