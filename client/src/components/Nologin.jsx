import Link from "next/link";
import { LogIn } from "lucide-react";

export default function Nologin({ message }) {
    return (
        <div className="flex flex-col items-center justify-center ">
            <div className="bg-green-50 rounded-full p-2 mb-2">
                <LogIn className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-md font-medium text-gray-800 mb-1">Not Logged In</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
                {message}
            </p>
            <Link href="/login">
                <button className="flex items-center gap-2 bg-green-200 hover:bg-green-100 text-gray-800 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1.5 sm:py-2 border border-green-300 rounded-md transition-colors mt-3">
                    <LogIn className="w-4 h-4" />
                    Login
                </button>
            </Link>
        </div>
    );
}