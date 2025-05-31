// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useAuth } from "../context/AuthContext";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//     Menu,
//     Home,
//     Trophy,
//     Settings,
//     HelpCircle,
//     BrainCircuit,
//     Lightbulb
// } from "lucide-react";
// import { SiLighthouse } from "react-icons/si";


// export default function Navbar() {
//     const { user, token, logout, loading } = useAuth();
//     console.log("token in navbar", token)
//     const [isOpen, setIsOpen] = useState(false); // State for mobile menu
//     const pathname = usePathname(); // Get current path
//     const router = useRouter(); // For programmatic navigation

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

//     const isActive = (path) => {
//         return pathname === path;
//     };

//     const handleLogout = async () => {
//         try {
//             logout();
//             router.push("/"); // Redirect to home page after logout
//         } catch (error) {
//             console.error("Error logging out:", error);
//         }
//     }

//     // Function to handle navigation from mobile menu
//     const handleMobileNavigation = (path) => {
//         setIsOpen(false); // Close the sheet
//         router.push(path); // Navigate to the path
//     };

//     if (loading) {
//         return (<div className="fixed top-0 left-0 right-0 z-50 p-4 border-b" style={{ backgroundColor: "#f0eee6", color: "#141413" }}>
//             <div className="flex items-center justify-between animate-pulse">
//                 {/* Logo */}
//                 <div className="h-6 w-24 bg-gray-300 rounded"></div>

//                 {/* Navigation Buttons Skeleton */}
//                 <div className="hidden lg:flex items-center space-x-4">
//                     {[...Array(6)].map((_, i) => (
//                         <div key={i} className="h-8 w-20 bg-gray-300 rounded"></div>
//                     ))}
//                 </div>

//                 {/* Right Side Icon */}
//                 <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
//             </div>
//         </div>
//         );
//     }
//     // borderBottom: "1px solid #f8f8fa"
//     return (
//         <nav className="fixed top-0 left-0 right-0 z-50 p-5 bg-white border border-b-gray-200  " style={{ color: "#141413", }}>
//             <div className="container mx-auto flex items-center justify-between">
//                 {/* Logo */}
//                 <div className="text-xl font-bold">NextStep</div>

//                 {/* Center Navigation Links - Only visible on desktop */}
//                 <div className="hidden lg:flex items-center justify-center space-x-1 flex-1">
//                     <div className="flex items-center justify-center space-x-1">
//                         <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/") ? "bg-slate-100  " : ""}`}>
//                             <Link href="/">
//                                 <Home className="h-5 w-5" />
//                                 Home</Link>
//                         </Button>
//                         <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/contests") ? "bg-slate-100  " : ""}`}>
//                             <Link href="/contests">
//                                 <Trophy className="h-5 w-5" />
//                                 Contests</Link>
//                         </Button>

//                         <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/integrate") ? "bg-slate-100  " : ""}`}>
//                             <Link href="/integrate">
//                                 <Settings className="h-5 w-5" />
//                                 Integrate</Link>
//                         </Button>
//                         <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/recommendation") ? "bg-slate-100 " : ""}`}>
//                             <Link href="/recommendation">
//                                 <Lightbulb className="h-5 w-5" />
//                                 My Recommendations</Link>
//                         </Button>
//                         <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/help") ? "bg-slate-100  " : ""}`}>
//                             <Link href="/help">
//                                 <HelpCircle className="h-5 w-5" />
//                                 Help</Link>
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Right side - Profile or Login + Mobile menu */}
//                 <div className="flex items-center space-x-4">
//                     {/* Login Button or User Profile - Visible on all screen sizes */}
//                     {!user ? (

//                         <button className="px-3 py-1 bg-green-50 hover:bg-green-100 text-gray-700 font-medium border border-green-200 rounded-md transition-all duration-200">
//                             <Link href="/login">Login</Link>
//                         </button>

//                     ) : (
//                         <div className="flex flex-col">


//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>

//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent>

//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Avatar className="h-8 w-8 cursor-pointer">
//                                         <AvatarImage src={user.photoURL} alt="Profile" />
//                                         <AvatarFallback>{getUserInitials()}</AvatarFallback>
//                                     </Avatar>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end" className="w-48">
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu></div>

//                     )}

//                     {/* Mobile Menu - Only visible on mobile */}
//                     <Sheet open={isOpen} onOpenChange={setIsOpen}>
//                         <SheetTrigger asChild>
//                             <Button variant="ghost" size="icon" className="lg:hidden bg-slate-50 border border-slate-100">
//                                 <Menu className="h-5 w-5 text-slate-600" />
//                                 <span className="sr-only">Toggle menu</span>
//                             </Button>
//                         </SheetTrigger>
//                         <SheetContent side="right" className="w-64">
//                             <SheetHeader>
//                                 <SheetTitle>NextStep</SheetTitle>
//                             </SheetHeader>
//                             <div className="flex flex-col space-y-3 mt-6">


//                                 <Button variant="ghost" className={`justify-start ${isActive("/") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/")}>
//                                     <Home className="h-5 w-5 mr-2" />
//                                     Home
//                                 </Button>

//                                 <Button variant="ghost" className={`justify-start ${isActive("/contests") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/contests")}>
//                                     <Trophy className="h-5 w-5 mr-2" />
//                                     Contests
//                                 </Button>
//                                 <Button variant="ghost" className={`justify-start ${isActive("/integrate") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/integrate")}>
//                                     <Settings className="h-5 w-5 mr-2" />
//                                     Integrate
//                                 </Button>
//                                 <Button variant="ghost" className={`justify-start ${isActive("/recommendation") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/recommendation")}>
//                                     <Lightbulb className="h-5 w-5 mr-2" />
//                                     My Recommendations
//                                 </Button>
//                                 <Button variant="ghost" className={`justify-start ${isActive("/help") ? "bg-blue-50" : ""}`} onClick={() => handleMobileNavigation("/help")}>
//                                     <HelpCircle className="h-5 w-5 mr-2" />
//                                     Help
//                                 </Button>
//                             </div>
//                         </SheetContent>
//                     </Sheet>
//                 </div>
//             </div>
//         </nav>
//     );
// }


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
    Lightbulb,
    Coins,
    ChevronDown
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
            setIsOpen(false);
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
                {/* <div className="text-xl font-bold tracking-wide" style={{ fontFamily: 'orbitron ' }}>NextStep</div> */}
                <div className="text-xl font-bold text-gray-900 tracking-wide" style={{ fontFamily: 'orbitron' }}>
                    Next<span className="text-blue-600">Step</span>
                </div>
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
                        <Button variant="ghost" asChild className={`text-sm font-medium transition-colors hover:bg-gray-100 ${isActive("/recommendation") ? "bg-slate-100 " : ""}`}>
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
                        <div className="flex items-center lg:space-x-5 space-x-2">
                            {/* Credits Dropdown */}
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>


                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-1 md:space-x-1 px-1 py-1 md:px-3 md:py-2 border border-yellow-100 bg-yellow-50 hover:bg-yellow-100"
                                    >
                                        <Coins className="h-2 w-2 md:h-4 md:w-4 text-yellow-600" />
                                        <span className="text-xs md:text-sm font-medium">{user.credits || 0}</span>
                                        <ChevronDown className="h-2 w-2 md:h-4 md:w-4 text-gray-500" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem>
                                        <div className="flex items-center space-x-2">
                                            <Coins className="h-4 w-4 text-yellow-600" />
                                            <span>Current Credits :<span className="ml-1 ">{user.credits || 0}</span> </span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem >
                                        <Link href="/payment" className="w-full ">Buy Credits</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 lg:h-10 lg:w-10 cursor-pointer">
                                        <AvatarImage src={user.photoURL} alt="Profile" />
                                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">

                                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}


                    {/* moblie menu  */}


                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden bg-slate-50 border border-slate-100"
                            >
                                <Menu className="h-5 w-5 text-slate-600" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="w-64 flex flex-col justify-between"
                        >
                            {/* Top Section */}
                            <div>
                                <SheetHeader>
                                    <SheetTitle style={{ fontFamily: 'orbitron ' }}>Next<span className="text-blue-500">Step</span></SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col space-y-3 mt-6">
                                    <Button
                                        variant="ghost"
                                        className={`justify-start ${isActive("/") ? "bg-blue-50" : ""}`}
                                        onClick={() => handleMobileNavigation("/")}
                                    >
                                        <Home className="h-5 w-5 mr-2" />
                                        Home
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`justify-start ${isActive("/contests") ? "bg-blue-50" : ""}`}
                                        onClick={() => handleMobileNavigation("/contests")}
                                    >
                                        <Trophy className="h-5 w-5 mr-2" />
                                        Contests
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`justify-start ${isActive("/integrate") ? "bg-blue-50" : ""}`}
                                        onClick={() => handleMobileNavigation("/integrate")}
                                    >
                                        <Settings className="h-5 w-5 mr-2" />
                                        Integrate
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`justify-start ${isActive("/recommendation") ? "bg-blue-50" : ""}`}
                                        onClick={() => handleMobileNavigation("/recommendation")}
                                    >
                                        <Lightbulb className="h-5 w-5 mr-2" />
                                        My Recommendations
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className={`justify-start ${isActive("/help") ? "bg-blue-50" : ""}`}
                                        onClick={() => handleMobileNavigation("/help")}
                                    >
                                        <HelpCircle className="h-5 w-5  mr-2" />
                                        Help
                                    </Button>
                                </div>
                            </div>

                            {/* Logout Button at Bottom */}
                            {user && <div className="mb-7 m-4">
                                <Button className="bg-red-400 w-full" onClick={handleLogout}>Log Out</Button>
                            </div>}
                        </SheetContent>
                    </Sheet>

                </div>
            </div>
        </nav>
    );
}