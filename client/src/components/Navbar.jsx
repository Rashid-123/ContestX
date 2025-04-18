
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // Import the auth context
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

export default function Navbar() {
    const { user, logout } = useAuth(); // Get user from auth context
    console.log(user)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Function to get user initials for avatar
    const getUserInitials = () => {
        if (!user) return "";
        if (user.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        } else if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "";
    };

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-xl font-bold">ContestX</div>

                {/* Mobile menu button */}
                <div className="block md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Desktop navigation */}
                <div className="hidden md:flex md:space-x-6 items-center">
                    <Link href="/" className="hover:underline">Home</Link>
                    <Link href="/contests" className="hover:underline">Contests</Link>
                    <Link href="/tasks" className="hover:underline">Tasks</Link>
                    <Link href="/hackathon" className="hover:underline">Hackathon</Link>
                    <Link href="/integrate" className="hover:underline">Integrate</Link>
                    <Link href="/help" className="hover:underline">Help</Link>

                    {/* Conditional rendering based on authentication status */}
                    {!user ? (
                        <Link
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                        >
                            Login
                        </Link>
                    ) : (
                        <div className="relative group">
                            {/* User avatar or initial */}
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full cursor-pointer"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer">
                                    {getUserInitials()}
                                </div>
                            )}
                            {/* Dropdown menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 hidden group-hover:block">
                                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-600">Profile</Link>
                                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-600">Settings</Link>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile navigation menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 space-y-3">
                    <Link href="/" className="block py-2 hover:bg-gray-700 px-2 rounded">Home</Link>
                    <Link href="/contests" className="block py-2 hover:bg-gray-700 px-2 rounded">Contests</Link>
                    <Link href="/tasks" className="block py-2 hover:bg-gray-700 px-2 rounded">Tasks</Link>
                    <Link href="/hackathon" className="block py-2 hover:bg-gray-700 px-2 rounded">Hackathon</Link>
                    <Link href="/integrate" className="block py-2 hover:bg-gray-700 px-2 rounded">Integrate</Link>
                    <Link href="/help" className="block py-2 hover:bg-gray-700 px-2 rounded">Help</Link>

                    {!user ? (
                        <Link
                            href="/login"
                            className="block py-2 bg-blue-600 hover:bg-blue-700 px-4 rounded text-center"
                        >
                            Login
                        </Link>
                    ) : (
                        <div className="space-y-2 pt-2 border-t border-gray-600">
                            <div className="flex items-center space-x-3 px-2">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        {getUserInitials()}
                                    </div>
                                )}
                                <span className="text-sm">{user.displayName || user.email}</span>
                            </div>
                            <Link href="/profile" className="block py-2 hover:bg-gray-700 px-2 rounded">Profile</Link>
                            <Link href="/settings" className="block py-2 hover:bg-gray-700 px-2 rounded">Settings</Link>
                            <button
                                onClick={logout}
                                className="block w-full text-left py-2 hover:bg-gray-700 px-2 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}