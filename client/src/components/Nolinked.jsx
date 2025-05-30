
import Link from "next/link";
import { SiLeetcode } from "react-icons/si";
import { User } from "lucide-react";
export default function Nolinked({ message }) {
    return (

        <div className="flex flex-col items-center justify-center ">
            <div className="bg-blue-50 rounded-full p-2 mb-2">
                <User className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="text-md font-medium text-gray-800 mb-1">No Username Provided</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
                {message}
            </p>
            <Link href="/integrate">
                <button className="flex items-center gap-2 bg-yellow-200 hover:bg-yellow-100 text-gray-800 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1.5 sm:py-2 border border-yellow-300 rounded-md transition-colors mt-3">
                    <SiLeetcode className="w-4 h-4" />
                    Integrate LeetCode
                </button>
            </Link>
        </div>
    );
}
