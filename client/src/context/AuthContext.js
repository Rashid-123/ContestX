
// "use client"
// import { useState, useEffect, createContext, useContext } from 'react';
// import { 
//   getAuth, 
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword,
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
//   updateProfile
// } from 'firebase/auth';
// import axios from 'axios';
// import { auth } from '../lib/firebase/config';

// const AuthContext = createContext({});

// const Backend_url = process.env.NEXT_BACKEND_URL;
// console.log(Backend_url);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//    console.log(user);
//   // API call to authenticate user with caching using axios
//   const authenticateWithToken = async (idToken) => {
//     try {
//       console.log(idToken)
//       // Check if we have cached user data that's not expired
//       const cachedAuth = localStorage.getItem('authData');
//       if (cachedAuth) {
//         const auth = JSON.parse(cachedAuth);
//         // Check if token is still valid (not expired)
//         if (auth.expiresAt > Date.now()) {
//           return auth.userData;
//         }
//       }
      
//       // If no valid cached data, authenticate with backend using axios
//       const response = await axios.post("http://localhost:5000/api/auth/login", { idToken }, {
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       const data = response.data;
      
//       // Cache the response with expiry (1 hour)
//       localStorage.setItem('authData', JSON.stringify({
//         userData: data,
//         expiresAt: Date.now() + (3600 * 1000) // expires in 1 hour
//       }));
      
//       return data;
//     } catch (error) {
//       console.error('Backend authentication error:', error);
//       throw error;
//     }
//   };

//   // Google Sign In
//   const signInWithGoogle = async () => {
//     try {
//       setLoading(true);
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
      
//       // Get the ID token
//       const idToken = await result.user.getIdToken();
      
//       // Authenticate with backend (with caching)
//       const userData = await authenticateWithToken(idToken);
      
//       setUser(userData.user);
//       return userData;
//     } catch (error) {
//       console.error('Google sign-in error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Email/Password Sign Up
//   const signUpWithEmail = async (email, password, displayName) => {
//     try {
//       setLoading(true);
//       const result = await createUserWithEmailAndPassword(auth, email, password);
      
//       // Update profile display name
//       await updateProfile(result.user, {
//         displayName: displayName || email.split('@')[0]
//       });
      
//       // Get the ID token
//       const idToken = await result.user.getIdToken();
      
//       // Authenticate with backend (with caching)
//       const userData = await authenticateWithToken(idToken);
      
//       setUser(userData.user);
//       return userData;
//     } catch (error) {
//       console.error('Email sign-up error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Email/Password Sign In
//   const signInWithEmail = async (email, password) => {
//     try {
//       setLoading(true);
//       const result = await signInWithEmailAndPassword(auth, email, password);
      
//       // Get the ID token
//       const idToken = await result.user.getIdToken();
      
//       // Authenticate with backend (with caching)
//       const userData = await authenticateWithToken(idToken);
      
//       setUser(userData.user);
//       return userData;
//     } catch (error) {
//       console.error('Email sign-in error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sign out
//   const signOut = async () => {
//     try {
//       await firebaseSignOut(auth);
//       localStorage.removeItem('authData'); // Clear cached auth data
//       setUser(null);
//     } catch (error) {
//       console.error('Sign-out error:', error);
//       throw error;
//     }
//   };

//   // Monitor auth state
//   useEffect(() => {
//     const initAuth = async () => {
//       // Try loading from cache first
//       const cachedAuth = localStorage.getItem('authData');
//       if (cachedAuth) {
//         const auth = JSON.parse(cachedAuth);
//         if (auth.expiresAt > Date.now()) {
//           setUser(auth.userData.user);
//           setLoading(false);
//           return;
//         } else {
//           // Clear expired auth data
//           localStorage.removeItem('authData');
//         }
//       }
      
//       // If no valid cache, listen for Firebase auth state
//       const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//         if (firebaseUser) {
//           try {
//             // Get the ID token
//             const idToken = await firebaseUser.getIdToken();
            
//             // Authenticate with backend (with caching)
//             const userData = await authenticateWithToken(idToken);
//             setUser(userData.user);
//           } catch (error) {
//             console.error('Auth state change error:', error);
//             setUser(null);
//           }
//         } else {
//           setUser(null);
//         }
//         setLoading(false);
//       });
      
//       return () => unsubscribe();
//     };
    
//     initAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       signInWithGoogle,
//       signUpWithEmail,
//       signInWithEmail,
//       signOut
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../lib/firebase/config';

const AuthContext = createContext({});

const Backend_url = process.env.NEXT_BACKEND_URL;
console.log(Backend_url);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
   console.log(user);
   console.log(token);
   
  // API call to authenticate user with caching using axios
  const authenticateWithToken = async (idToken) => {
    try {
      console.log(idToken)
      // Check if we have cached user data that's not expired
      const cachedAuth = localStorage.getItem('authData');
      if (cachedAuth) {
        const auth = JSON.parse(cachedAuth);
        // Check if token is still valid (not expired)
        if (auth.expiresAt > Date.now()) {
          // Set token from cached data
          setToken(auth.userData.token);
          return auth.userData;
        }
      }
      
      // If no valid cached data, authenticate with backend using axios
      const response = await axios.post("http://localhost:5000/api/auth/login", { idToken }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = response.data;
      
      // Store the token in state
      setToken(data.token);
      
      // Store token in localStorage separately
      localStorage.setItem('authToken', data.token);
      
      // Cache the response with expiry (1 hour)
      localStorage.setItem('authData', JSON.stringify({
        userData: data,
        expiresAt: Date.now() + (3600 * 1000) // expires in 1 hour
      }));
      
      return data;
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Authenticate with backend (with caching)
      const userData = await authenticateWithToken(idToken);
      
      setUser(userData.user);
      return userData;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign Up
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile display name
      await updateProfile(result.user, {
        displayName: displayName || email.split('@')[0]
      });
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Authenticate with backend (with caching)
      const userData = await authenticateWithToken(idToken);
      
      setUser(userData.user);
      return userData;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Authenticate with backend (with caching)
      const userData = await authenticateWithToken(idToken);
      
      setUser(userData.user);
      return userData;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('authData'); // Clear cached auth data
      localStorage.removeItem('authToken'); // Clear token
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  // Monitor auth state
  useEffect(() => {
    const initAuth = async () => {
      // Try loading from cache first
      const cachedAuth = localStorage.getItem('authData');
      const cachedToken = localStorage.getItem('authToken');
      
      if (cachedAuth) {
        const auth = JSON.parse(cachedAuth);
        if (auth.expiresAt > Date.now()) {
          setUser(auth.userData.user);
          setToken(cachedToken || auth.userData.token);
          setLoading(false);
          return;
        } else {
          // Clear expired auth data
          localStorage.removeItem('authData');
          localStorage.removeItem('authToken');
        }
      }
      
      // If no valid cache, listen for Firebase auth state
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get the ID token
            const idToken = await firebaseUser.getIdToken();
            
            // Authenticate with backend (with caching)
            const userData = await authenticateWithToken(idToken);
            setUser(userData.user);
            // Token is set in authenticateWithToken
          } catch (error) {
            console.error('Auth state change error:', error);
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
        setLoading(false);
      });
      
      return () => unsubscribe();
    };
    
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      signInWithGoogle,
      signUpWithEmail,
      signInWithEmail,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);