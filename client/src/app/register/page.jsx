"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { registerWithEmailPassword, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const result = await registerWithEmailPassword(email, password);
            setMessage(result.message);
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
            <h1>Register</h1>

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>

            <div>
                <button onClick={handleGoogleSignIn}>Continue with Google</button>
            </div>

            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
}
