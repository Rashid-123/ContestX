// controllers/authController.js

import mongoose from 'mongoose';
import User from "../models/User.js"
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
console.log("Private Key:", process.env.FIREBASE_PRIVATE_KEY);

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

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      firebaseUID: user.firebaseUID
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generic authentication handler for both methods
 const handleLogin= async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'ID token is required' });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;
    
    // Check if user exists
    let user = await User.findOne({ firebaseUID: uid });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firebaseUID: uid,
        email: email,
        displayName: name || email.split('@')[0], // Use name from token or generate from email
        photoURL: picture || '',
        role:"user",
      });
      
      await user.save();
    }
    
    // Generate JWT token
    const jwtToken = generateToken(user);
    
    // Update user with new token
    user.jwtToken = jwtToken;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
      },
      token: jwtToken,
      isNewUser: decodedToken.firebase.sign_in_provider === 'password' ? 
        (decodedToken.firebase.sign_in_attributes?.isNewUser || false) : false
    });
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

export default handleLogin;
