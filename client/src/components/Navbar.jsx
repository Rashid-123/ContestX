"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
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
    Settings,
    HelpCircle,
    BrainCircuit,
    Lightbulb
} from "lucide-react";
import { SiLighthouse } from "react-icons/si";


export default function Navbar() {
    const { user, token, logout, loading } = useAuth();
    console.log("token in navbar", token)
    const [isOpen, setIsOpen] = useState(false); // State for mobile menu
    const pathname = usePathname(); // Get current path
    const router = useRouter(); // For programmatic navigation

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

    const handleLogout = async () => {
        try {
            logout();
            router.push("/"); // Redirect to home page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    // Function to handle navigation from mobile menu
    const handleMobileNavigation = (path) => {
        setIsOpen(false); // Close the sheet
        router.push(path); // Navigate to the path
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
    // borderBottom: "1px solid #f8f8fa"
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-5 bg-white border border-b-gray-200  " style={{ color: "#141413", }}>
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-bold">NextStep</div>

                {/* Center Navigation Links - Only visible on desktop */}
                <div className="hidden lg:flex items-center justify-center space-x-1 flex-1">
                    <div className="flex items-center justify-center space-x-1">
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/") ? "bg-slate-100  " : ""}`}>
                            <Link href="/">
                                <Home className="h-5 w-5" />
                                Home</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/contests") ? "bg-slate-100  " : ""}`}>
                            <Link href="/contests">
                                <Trophy className="h-5 w-5" />
                                Contests</Link>
                        </Button>

                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/integrate") ? "bg-slate-100  " : ""}`}>
                            <Link href="/integrate">
                                <Settings className="h-5 w-5" />
                                Integrate</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray100 ${isActive("/recommendation") ? "bg-slate-100   " : ""}`}>
                            <Link href="/recommendation">
                                <Lightbulb className="h-5 w-5" />
                                My Recommendations</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/help") ? "bg-slate-100  " : ""}`}>
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

                        <button className="px-3 py-1 bg-green-50 hover:bg-green-100 text-gray-700 font-medium border border-green-200 rounded-md transition-all duration-200">
                            <Link href="/login">Login</Link>
                        </button>

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
                                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Mobile Menu - Only visible on mobile */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden bg-slate-50 border border-slate-100">
                                <Menu className="h-5 w-5 text-slate-600" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <SheetHeader>
                                <SheetTitle>NextStep</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col space-y-3 mt-6">


                                <Button variant="ghost" className={`justify-start ${isActive("/") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/")}>
                                    <Home className="h-5 w-5 mr-2" />
                                    Home
                                </Button>

                                <Button variant="ghost" className={`justify-start ${isActive("/contests") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/contests")}>
                                    <Trophy className="h-5 w-5 mr-2" />
                                    Contests
                                </Button>
                                <Button variant="ghost" className={`justify-start ${isActive("/integrate") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/integrate")}>
                                    <Settings className="h-5 w-5 mr-2" />
                                    Integrate
                                </Button>
                                <Button variant="ghost" className={`justify-start ${isActive("/recommendation") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/recommendation")}>
                                    <Lightbulb className="h-5 w-5 mr-2" />
                                    My Recommendations
                                </Button>
                                <Button variant="ghost" className={`justify-start ${isActive("/help") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/help")}>
                                    <HelpCircle className="h-5 w-5 mr-2" />
                                    Help
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}