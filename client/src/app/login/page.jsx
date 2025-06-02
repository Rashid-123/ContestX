
// "use client";

// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react";

// export default function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isLogingIn, setIsLogingIn] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const { loginWithEmailPassword, signInWithGoogle } = useAuth();
//     const router = useRouter();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setIsLogingIn(true)
//         try {
//             setError('');
//             await loginWithEmailPassword(email, password);
//             router.push('/');
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setIsLoading(false);
//             setIsLogingIn(false);
//         }
//     };

//     const handleGoogleSignIn = async () => {
//         setIsLoading(true);
//         try {
//             setError('');
//             await signInWithGoogle();
//             router.push('/');
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen px-4">
//             <Card className="w-full max-w-md shadow-xs">
//                 <CardHeader className="space-y-1">
//                     <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
//                     <CardDescription className="text-center text-gray-500">
//                         Enter your credentials to access your account
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {error && (
//                         <Alert variant="destructive" className="bg-red-50 text-red-700 border border-red-200">
//                             <AlertDescription>{error}</AlertDescription>
//                         </Alert>
//                     )}

//                     <form onSubmit={handleLogin} className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="email" className="text-sm font-medium">
//                                 Email
//                             </Label>
//                             <div className="relative">
//                                 <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     placeholder="name@example.com"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="pl-10"
//                                     required
//                                 />
//                             </div>
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="password" className="text-sm font-medium">
//                                 Password
//                             </Label>
//                             <div className="relative">
//                                 <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                                 <Input
//                                     id="password"
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder="••••••••"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="pl-10 pr-10"
//                                     required
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={togglePasswordVisibility}
//                                     className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
//                                     tabIndex={-1}
//                                 >
//                                     {showPassword ? (
//                                         <EyeOffIcon className="h-4 w-4" />
//                                     ) : (
//                                         <EyeIcon className="h-4 w-4" />
//                                     )}
//                                 </button>
//                             </div>
//                         </div>
//                         <Button
//                             type="submit"
//                             className="w-full  text-white font-semibold"
//                             disabled={isLogingIn}
//                             style={{ backgroundColor: "#3B82F6" }} >
//                             {isLogingIn ? "Logging in..." : "Login"}
//                         </Button>
//                     </form>

//                     <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                             <span className="w-full border-t border-gray-200" />
//                         </div>
//                         <div className="relative flex justify-center text-xs uppercase">
//                             <span className="bg-white px-2 text-gray-500">Or continue with</span>
//                         </div>
//                     </div>

//                     <Button
//                         variant="outline"
//                         type="button"
//                         onClick={handleGoogleSignIn}
//                         disabled={isLoading}
//                         className="w-full font-normal text-base border-gray-300 hover:bg-gray-50"
//                     >
//                         <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
//                             <path
//                                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                 fill="#4285F4"
//                             />
//                             <path
//                                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                 fill="#34A853"
//                             />
//                             <path
//                                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                 fill="#FBBC05"
//                             />
//                             <path
//                                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                 fill="#EA4335"
//                             />
//                             <path d="M1 1h22v22H1z" fill="none" />
//                         </svg>
//                         Continue with Google
//                     </Button>
//                 </CardContent>
//                 <CardFooter className="flex justify-center">
//                     <p className="text-sm text-gray-600">
//                         Don't have an account?{" "}
//                         <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
//                             Register
//                         </a>
//                     </p>
//                 </CardFooter>
//             </Card>
//         </div>
//     );
// }


"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react";

// Import auth and sendEmailVerification for resend functionality
import { auth } from "../../lib/firebase/config"; // Adjust path as necessary
import { sendEmailVerification } from 'firebase/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // Added for success messages (e.g., resend email)
    const [isLoading, setIsLoading] = useState(false);
    const [isLogingIn, setIsLogingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { loginWithEmailPassword, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLogingIn(true);
        setError(''); // Clear previous error
        setMessage(''); // Clear previous message
        try {
            await loginWithEmailPassword(email, password);
            router.push('/'); // Redirect on successful login
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsLogingIn(false);
        }
    };

    const handleResendVerification = async () => {
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            // It's important to have the user's Firebase user object to resend the email.
            // If the user just tried to log in, Firebase might have a temporary user object.
            // However, a more robust way might be to ask for their email again,
            // or have this button only appear after an initial failed login due to unverified email.
            // For now, we'll try to use `auth.currentUser`.
            // Note: `auth.currentUser` might be null if the user isn't actively signed in.
            // The best flow is to only show this button if the login attempt _just failed_ because of unverified email.

            // To make this robust, if the error is "Please verify your email...",
            // we should assume the email they *just typed in* is the one to resend to.
            // Firebase's `sendSignInLinkToEmail` or `sendEmailVerification` on a newly created user is better.
            // For an *existing* user who can't log in because of verification, we need to
            // ensure we target *that* user's email.

            // A more direct way to resend to the *entered* email, even if not logged in:
            // This assumes the user typed a valid email and it's just unverified.
            // Firebase's sendEmailVerification usually requires a user object.
            // If the user isn't logged in, `auth.currentUser` would be null.

            // Let's modify this to use the `email` from the state,
            // and assume they are trying to verify *that* specific account.
            // This would typically involve a separate Firebase function to send a verification
            // email to an *unauthenticated* user, which Firebase doesn't directly offer for verification.
            // The `sendEmailVerification` function requires an active `User` object.

            // A simpler approach (and what your AuthContext already does) is:
            // 1. User tries to log in.
            // 2. `loginWithEmailPassword` throws an error if email is not verified.
            // 3. The error message is displayed.
            // 4. We provide a button that, when clicked, attempts to re-send.
            //    To re-send, the user must either be already signed in (but unverified)
            //    or you need to re-authenticate them briefly to get a user object.

            // Given your `loginWithEmailPassword` already throws an error
            // if the user's email isn't verified, this `handleResendVerification`
            // should probably only attempt to resend if `auth.currentUser`
            // exists and is the unverified user.

            if (auth.currentUser) {
                // If the user is currently "logged in" but unverified (e.g., from a fresh registration
                // before refreshing the page, or if they tried to log in successfully but emailVerified is false).
                if (!auth.currentUser.emailVerified) {
                    await sendEmailVerification(auth.currentUser);
                    setMessage('Verification email re-sent! Please check your inbox and spam folder.');
                } else {
                    setMessage('Your email is already verified!');
                }
            } else {
                // If auth.currentUser is null, it means no user is currently authenticated in Firebase.
                // This means the user must have closed the browser, or wasn't correctly logged in.
                // In this case, simply prompt them to log in again, or ensure the error message
                // from the initial login attempt guides them.
                setError('Please log in first to resend the verification email, or register if you haven\'t.');
            }
        } catch (err) {
            console.error('Error re-sending verification email:', err);
            setError('Failed to re-send verification email: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            await signInWithGoogle();
            router.push('/'); // Redirect on successful Google sign-in
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <Card className="w-full max-w-md shadow-xs">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                    <CardDescription className="text-center text-gray-500">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive" className="bg-red-50 text-red-700 border border-red-200">
                            <AlertDescription>{error}</AlertDescription>
                            {/* Display resend option if the error is due to unverified email */}
                            {error.includes('verify your email') && (
                                <Button
                                    variant="link"
                                    onClick={handleResendVerification}
                                    disabled={isLoading}
                                    className="p-0 h-auto text-red-600 hover:text-red-800 font-medium mt-2"
                                >
                                    {isLoading ? "Sending..." : "Resend Verification Email"}
                                </Button>
                            )}
                        </Alert>
                    )}

                    {message && (
                        <Alert className="bg-green-50 text-green-700 border border-green-200">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full text-white font-semibold"
                            disabled={isLogingIn || isLoading}
                            style={{ backgroundColor: "#3B82F6" }} >
                            {isLogingIn ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading || isLogingIn}
                        className="w-full font-normal text-base border-gray-300 hover:bg-gray-50"
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Continue with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                            Register
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}