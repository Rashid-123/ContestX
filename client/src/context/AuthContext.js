"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from "../lib/firebase/config"; // Adjust the import path as necessary
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token , setToken] = useState(null);
  // Function to handle Google sign-in
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get Firebase ID token
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      // Send to backend to create/find user in MongoDB
      const response = await axios.post('http://localhost:5000/api/auth/login', { idToken });
      
      // User data from backend
      setUser(response.data.user);
      
      return response.data.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Email/password registration
  const registerWithEmailPassword = async (email, password) => {
    try {
      // This only creates a Firebase account, no backend call yet
      await createUserWithEmailAndPassword(auth, email, password);
      // Return success message
      return { success: true, message: 'Registration successful! Please verify your email.' };
    } catch (error) {
      console.error('Error registering with email/password:', error);
      throw error;
    }
  };

  // Email/password login
  const loginWithEmailPassword = async (email, password) => {
    try {
      // Sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!result.user.emailVerified) {
        throw new Error('Please verify your email before logging in');
      }
      
      // Get Firebase ID token
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      // Send to backend to create/find user in MongoDB
      const response = await axios.post('http://localhost:5000/api/auth/login', { idToken });
      
      // User data from backend
      setUser(response.data.user);
      
      return response.data.user;
    } catch (error) {
      console.error('Error logging in with email/password:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setToken(null)
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified || firebaseUser.providerData[0].providerId === 'google.com') {
          try {
            // Get Firebase ID token
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
            // Fetch user data from backend
            const response = await axios.post('http://localhost:5000/api/auth/login', { idToken });
            setUser(response.data.user);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          // Email not verified
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      loading,
      signInWithGoogle,
      registerWithEmailPassword,
      loginWithEmailPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);