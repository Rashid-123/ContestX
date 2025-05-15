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
    CheckSquare,
    Code,
    Puzzle,
    HelpCircle,
    Router
} from "lucide-react";


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
    //#f0eee6

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4.5  shadow-sm " style={{ backgroundColor: "white", color: "#141413", borderBottom: "1px solid #faf9f5" }}>
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-bold">ContestCraft</div>

                {/* Center Navigation Links - Only visible on desktop */}
                <div className="hidden lg:flex items-center justify-center space-x-1 flex-1">
                    <div className="flex items-center justify-center space-x-1">
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/60 ${isActive("/") ? "bg-muted/60" : ""}`}>
                            <Link href="/">
                                <Home className="h-5 w-5" />
                                Home</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/60 ${isActive("/contests") ? "bg-muted/60" : ""}`}>
                            <Link href="/contests">
                                <Trophy className="h-5 w-5" />
                                Contests</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/60 ${isActive("/tasks") ? "bg-muted/60" : ""}`}>
                            <Link href="/tasks">
                                <CheckSquare className="h-5 w-5" />
                                Tasks</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/60 ${isActive("/hackathon") ? "bg-muted/60" : ""}`}>

                            <Link href="/hackathon">
                                <Code className="h-5 w-5" />
                                Hackathon</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/60 ${isActive("/integrate") ? "bg-muted/60" : ""}`}>
                            <Link href="/integrate">
                                <Puzzle className="h-5 w-5" />
                                Integrate</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-muted/60 ${isActive("/help") ? "bg-muted/60" : ""}`}>
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
                                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
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
