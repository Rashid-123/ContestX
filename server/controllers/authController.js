import mongoose from 'mongoose';
import User from "../models/user.js"
import admin from 'firebase-admin';
import dotenv from "dotenv";
dotenv.config();
// console.log("Private Key:", process.env.FIREBASE_PRIVATE_KEY);

// Initialize Firebase Admin - make sure you have set up your service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
  const handleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }
    // console.log('Received ID Token:', idToken);
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // console.log('Decoded Token:', decodedToken);
    const { uid, email, name, picture } = decodedToken;
  //  console.log('Decoded Token UID:', uid);
    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUID: uid });
    // console.log('User found:', user);
    if (!user) {
      // Create new user if not found
      user = new User({
        firebaseUID: uid,
        email,
        displayName: name || '',
        photoURL: picture || '',
        role: 'user', // Default role
        bookmarked: [], // Default bookmarked array
      });
      await user.save();
    }
    console.log('User after find/create:', user);
    res.json({ 
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        bookmarked: user.bookmarked,
        leetcode: user.leetcode,
        github: user.github,
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export {handleAuth}