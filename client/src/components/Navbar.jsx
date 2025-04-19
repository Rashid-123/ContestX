
// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useAuth } from "../context/AuthContext"; // Import the auth context
// import { Menu, X } from "lucide-react"; // Import icons for mobile menu

// export default function Navbar() {
//     const { user, logout, loading } = useAuth(); // Get user from auth context
//     console.log(user)
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     // Function to get user initials for avatar
//     const getUserInitials = () => {
//         if (!user) return "";
//         if (user.displayName) {
//             return user.displayName.charAt(0).toUpperCase();
//         } else if (user.email) {
//             return user.email.charAt(0).toUpperCase();
//         }
//         return "";
//     };

//     // Toggle mobile menu
//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     if (loading) return null;

//     return (
//         <nav className=" text-white p-4" style={{ backgroundColor: "#e3dacc", color: "#141413" }}>
//             <div className="container mx-auto flex justify-between items-center">
//                 {/* Logo */}
//                 <div className="text-xl font-bold">ContestX</div>

//                 {/* Mobile menu button */}
//                 <div className="block md:hidden">
//                     <button onClick={toggleMenu} className="text-white focus:outline-none">
//                         {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//                     </button>
//                 </div>

//                 {/* Desktop navigation */}
//                 <div className="hidden md:flex md:space-x-6 items-center">
//                     <Link href="/" className="hover:underline">Home</Link>
//                     <Link href="/contests" className="hover:underline">Contests</Link>
//                     <Link href="/tasks" className="hover:underline">Tasks</Link>
//                     <Link href="/hackathon" className="hover:underline">Hackathon</Link>
//                     <Link href="/integrate" className="hover:underline">Integrate</Link>
//                     <Link href="/help" className="hover:underline">Help</Link>

//                     {/* Conditional rendering based on authentication status */}
//                     {!user ? (
//                         <Link
//                             href="/login"
//                             className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
//                         >
//                             Login
//                         </Link>
//                     ) : (
//                         <div className="relative group">
//                             {/* User avatar or initial */}
//                             {user.photoURL ? (
//                                 <img
//                                     src={user.photoURL}
//                                     alt="Profile"
//                                     className="w-8 h-8 rounded-full cursor-pointer"
//                                 />
//                             ) : (
//                                 <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer">
//                                     {getUserInitials()}
//                                 </div>
//                             )}
//                             {/* Dropdown menu */}
//                             <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 hidden group-hover:block">
//                                 <Link href="/profile" className="block px-4 py-2 hover:bg-gray-600">Profile</Link>
//                                 <Link href="/settings" className="block px-4 py-2 hover:bg-gray-600">Settings</Link>
//                                 <button
//                                     onClick={logout}
//                                     className="block w-full text-left px-4 py-2 hover:bg-gray-600"
//                                 >
//                                     Logout
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Mobile navigation menu */}
//             {isMenuOpen && (
//                 <div className="md:hidden mt-4 space-y-3">
//                     <Link href="/" className="block py-2 hover:bg-gray-700 px-2 rounded">Home</Link>
//                     <Link href="/contests" className="block py-2 hover:bg-gray-700 px-2 rounded">Contests</Link>
//                     <Link href="/tasks" className="block py-2 hover:bg-gray-700 px-2 rounded">Tasks</Link>
//                     <Link href="/hackathon" className="block py-2 hover:bg-gray-700 px-2 rounded">Hackathon</Link>
//                     <Link href="/integrate" className="block py-2 hover:bg-gray-700 px-2 rounded">Integrate</Link>
//                     <Link href="/help" className="block py-2 hover:bg-gray-700 px-2 rounded">Help</Link>

//                     {!user ? (
//                         <Link
//                             href="/login"
//                             className="block py-2 bg-blue-600 hover:bg-blue-700 px-4 rounded text-center"
//                         >
//                             Login
//                         </Link>
//                     ) : (
//                         <div className="space-y-2 pt-2 border-t border-gray-600">
//                             <div className="flex items-center space-x-3 px-2">
//                                 {user.photoURL ? (
//                                     <img
//                                         src={user.photoURL}
//                                         alt="Profile"
//                                         className="w-8 h-8 rounded-full"
//                                     />
//                                 ) : (
//                                     <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
//                                         {getUserInitials()}
//                                     </div>
//                                 )}
//                                 <span className="text-sm">{user.displayName || user.email}</span>
//                             </div>
//                             <Link href="/profile" className="block py-2 hover:bg-gray-700 px-2 rounded">Profile</Link>
//                             <Link href="/settings" className="block py-2 hover:bg-gray-700 px-2 rounded">Settings</Link>
//                             <button
//                                 onClick={logout}
//                                 className="block w-full text-left py-2 hover:bg-gray-700 px-2 rounded"
//                             >
//                                 Logout
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </nav>
//     );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Menu,
    Home,
    Trophy,
    CheckSquare,
    Code,
    Puzzle,
    HelpCircle
} from "lucide-react";


export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname(); // Get current path

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

    const isActive = (path) => {
        return pathname === path;
    };

    if (loading) {
        return (<div className="fixed top-0 left-0 right-0 z-50 p-4 border-b" style={{ backgroundColor: "#f0eee6", color: "#141413" }}>
            <div className="flex items-center justify-between animate-pulse">
                {/* Logo */}
                <div className="h-6 w-24 bg-gray-300 rounded"></div>

                {/* Navigation Buttons Skeleton */}
                <div className="hidden lg:flex items-center space-x-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 w-20 bg-gray-300 rounded"></div>
                    ))}
                </div>

                {/* Right Side Icon */}
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
        </div>
        );
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 border-b" style={{ backgroundColor: "#f0eee6", color: "#141413" }}>
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-bold">ContestCraft</div>

                {/* Center Navigation Links - Only visible on desktop */}
                <div className="hidden lg:flex items-center justify-center space-x-1 flex-1">
                    <div className="flex items-center justify-center space-x-1">
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/100 ${isActive("/") ? "bg-muted" : ""}`}>
                            <Link href="/">
                                <Home className="h-5 w-5" />
                                Home</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/100 ${isActive("/contests") ? "bg-muted" : ""}`}>
                            <Link href="/contests">
                                <Trophy className="h-5 w-5" />
                                Contests</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/100 ${isActive("/tasks") ? "bg-muted" : ""}`}>
                            <Link href="/tasks">
                                <CheckSquare className="h-5 w-5" />
                                Tasks</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/100 ${isActive("/hackathon") ? "bg-muted" : ""}`}>

                            <Link href="/hackathon">
                                <Code className="h-5 w-5" />
                                Hackathon</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/100 ${isActive("/integrate") ? "bg-muted" : ""}`}>
                            <Link href="/integrate">
                                <Puzzle className="h-5 w-5" />
                                Integrate</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/100 ${isActive("/help") ? "bg-muted" : ""}`}>
                            <Link href="/help">
                                <HelpCircle className="h-5 w-5" />
                                Help</Link>
                        </Button>
                    </div>
                </div>

                {/* Right side - Profile or Login + Mobile menu */}
                <div className="flex items-center space-x-4">
                    {/* Login Button or User Profile - Visible on all screen sizes */}
                    {!user ? (
                        // <Button asChild variant="secondary" size="sm" className="rounded-full">
                        //     <Link href="/login">Login</Link>
                        // </Button>
                        <Button
                            style={{ backgroundColor: "#28a745", color: "#f0eee6", padding: "10px 20px", radius: "5px" }}
                        >
                            <Link href="/login">Login</Link>
                        </Button>

                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    <AvatarImage src={user.photoURL} alt="Profile" />
                                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Mobile Menu - Only visible on mobile */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <SheetHeader>
                                <SheetTitle>ContestX</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col space-y-3 mt-6">
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/">
                                        <Home className="h-5 w-5" />
                                        Home</Link>
                                </Button>
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/contests">
                                        <Trophy className="h-5 w-5" />
                                        Contests</Link>
                                </Button>
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/tasks">
                                        <CheckSquare className="h-5 w-5" />
                                        Tasks</Link>
                                </Button>
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/hackathon">
                                        <Code className="h-5 w-5" />
                                        Hackathon</Link>
                                </Button>
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/integrate">
                                        <Puzzle className="h-5 w-5" />
                                        Integrate</Link>
                                </Button>
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/help">
                                        <HelpCircle className="h-5 w-5" />
                                        Help</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}