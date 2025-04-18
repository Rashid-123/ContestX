"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginWithEmailPassword, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await loginWithEmailPassword(email, password);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            await signInWithGoogle();
            router.push('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            <div>
                <button onClick={handleGoogleSignIn}>Continue with Google</button>
            </div>

            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
}
