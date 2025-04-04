// app/resend-verification/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase/config';

export default function ResendVerificationPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResendVerification = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );

            // Check if already verified
            if (userCredential.user.emailVerified) {
                setError('Your email is already verified. You can log in now.');
                setLoading(false);
                return;
            }

            // Send verification email
            await sendEmailVerification(userCredential.user);

            // Set success
            setSuccess(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>

                    <h1 className="text-2xl font-bold">Verification Email Sent</h1>

                    <p className="text-gray-600">
                        We've sent a new verification email to <strong>{email}</strong>.
                        Please check your inbox and click the verification link.
                    </p>

                    <div className="pt-4">
                        <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            Go to Login Page
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Resend Verification Email</h1>
                    <p className="mt-2 text-gray-600">
                        Enter your email and password to receive a new verification link
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleResendVerification} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-gray-600">
                        Remember your password?{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}