// "use client";

// import { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   onAuthStateChanged, 
//   signInWithPopup, 
//   GoogleAuthProvider,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut
// } from 'firebase/auth';
// import { auth } from "../lib/firebase/config"; // Adjust the import path as necessary
// import axios from 'axios';

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token , setToken] = useState(null);
//   // Function to handle Google sign-in
//   const signInWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
      
//       // Get Firebase ID token
//       const idToken = await result.user.getIdToken();
//       setToken(idToken);
//       // Send to backend to create/find user in MongoDB
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, { idToken });
      
//       // User data from backend
//       setUser(response.data.user);
      
//       return response.data.user;
//     } catch (error) {
//       console.error('Error signing in with Google:', error);
//       throw error;
//     }
//   };

//   // Email/password registration
//   const registerWithEmailPassword = async (email, password) => {
//     try {
//       // This only creates a Firebase account, no backend call yet
//       await createUserWithEmailAndPassword(auth, email, password);
//       // Return success message
//       return { success: true, message: 'Registration successful! Please verify your email.' };
//     } catch (error) {
//       console.error('Error registering with email/password:', error);
//       throw error;
//     }
//   };

//   // Email/password login
//   const loginWithEmailPassword = async (email, password) => {
//     try {
//       // Sign in with Firebase
//       const result = await signInWithEmailAndPassword(auth, email, password);
      
//       // Check if email is verified
//       if (!result.user.emailVerified) {
//         throw new Error('Please verify your email before logging in');
//       }
      
//       // Get Firebase ID token
//       const idToken = await result.user.getIdToken();
//       setToken(idToken);
//       // Send to backend to create/find user in MongoDB
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, { idToken });
      
//       // User data from backend
//       setUser(response.data.user);
      
//       return response.data.user;
//     } catch (error) {
//       console.error('Error logging in with email/password:', error);
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setToken(null)
//       setUser(null);
//     } catch (error) {
//       console.error('Error logging out:', error);
//       throw error;
//     }
//   };

//   // Listen to Firebase auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         if (firebaseUser.emailVerified || firebaseUser.providerData[0].providerId === 'google.com') {
//           try {
//             // Get Firebase ID token
//             const idToken = await firebaseUser.getIdToken();
//             setToken(idToken);
//             // Fetch user data from backend
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, { idToken });
//             setUser(response.data.user);
//           } catch (error) {
//             console.error('Error fetching user data:', error);
//             setUser(null);
//           }
//         } else {
//           // Email not verified
//           setUser(null);
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       setUser,
//       token,
//       loading,
//       signInWithGoogle,
//       registerWithEmailPassword,
//       loginWithEmailPassword,
//       logout
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification // Added for email verification
} from 'firebase/auth';
import { auth } from "../lib/firebase/config"; // Adjust the import path as necessary
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Function to handle Google sign-in
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get Firebase ID token
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      // Send to backend to create/find user in MongoDB
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, { idToken });

      // User data from backend
      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Email/password registration - NOW SENDS VERIFICATION EMAIL
  const registerWithEmailPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Send email verification immediately after account creation
      await sendEmailVerification(userCredential.user);

      return { success: true, message: 'Registration successful! A verification email has been sent to your inbox. Please check your spam folder as well.' };
    } catch (error) {
      console.error('Error registering with email/password:', error);
      // Firebase error codes might help provide more specific messages
      let errorMessage = 'Failed to register. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please try logging in or use a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password (at least 6 characters).';
      }
      throw new Error(errorMessage);
    }
  };

  // Email/password login - CHECKS FOR EMAIL VERIFICATION
  const loginWithEmailPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified
      if (!result.user.emailVerified) {
        // You can add logic to re-send verification here if needed,
        // or just throw the error. For now, throwing the error is sufficient.
        throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
      }

      // Get Firebase ID token
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      // Send to backend to create/find user in MongoDB
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, { idToken });

      // User data from backend
      setUser(response.data.user);

      return response.data.user;
    } catch (error) {
      console.error('Error logging in with email/password:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password.';
      } else if (error.message.includes('verify your email')) { // Custom error message from above
        errorMessage = error.message; // Use the specific verification error
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Your account has been disabled. Please contact support.';
      }
      throw new Error(errorMessage);
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
        // Only consider the user authenticated if their email is verified or they logged in with Google
        if (firebaseUser.emailVerified || firebaseUser.providerData[0].providerId === 'google.com') {
          try {
            // Get Firebase ID token
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
            // Fetch user data from backend
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, { idToken });
            setUser(response.data.user);
          } catch (error) {
            console.error('Error fetching user data from backend:', error);
            setUser(null); // Clear user if backend call fails
            // Consider logging out the Firebase user if backend sync fails repeatedly
            // signOut(auth); 
          }
        } else {
          // If email is not verified, and it's not a Google sign-in, user is not considered authenticated by the app
          setUser(null);
          // You might choose to log them out of Firebase here if you strictly enforce verification
          // signOut(auth); 
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
      setUser,
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