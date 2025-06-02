
import dotenv from "dotenv";
dotenv.config();
import admin from 'firebase-admin';

import mongoose from 'mongoose';
import User from "../models/User.js"
import { redis } from "../lib/redis.js"; // Assuming you have your Redis client setup

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) {
  console.error("🔥 FIREBASE_PRIVATE_KEY is not defined in environment variables");
  throw new Error("FIREBASE_PRIVATE_KEY is missing");
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });
}
      // privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),

const USER_CACHE_TTL_SECONDS = 60 * 15; // Cache user for 15 minutes

const handleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Firebase ID token (NOT CACHED - Security Critical)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    const cacheKey = `user:${uid}`; // Unique cache key for the user

    let user;

    // --- Try to get user from cache ---
    // try {
    //   const cachedUser = await redis.get(cacheKey);
    //   if (cachedUser) {
    //     console.log(`User ${uid} found in cache.`);
    //     // Assuming your redis client auto-parses JSON, otherwise you'd do JSON.parse(cachedUser)
    //     user = cachedUser;
    //   }
    // } catch (cacheError) {
    //   console.error("Error reading from Redis cache for user:", cacheError);
    //   // Don't block the request, proceed to database
    // }


    if (!user) { // If not found in cache or cache read failed
      console.log(`User ${uid} not found in cache, fetching from DB.`);
      // Find or create user in MongoDB
      user = await User.findOne({ firebaseUID: uid });

      if (!user) {
        // console.log("New user is created");
        // Create new user if not found
        user = new User({
          firebaseUID: uid,
          email,
          displayName: name || '',
          photoURL: picture || '',
          role: 'user',
          bookmarked: [],
          credits:50,

        });
        await user.save();
      }

      // --- Cache the user object after fetching/creating ---
      try {
        // Store user as a plain JavaScript object if your Redis client handles serialization,
        // otherwise JSON.stringify(user.toObject()) is safer for Mongoose documents.
        await redis.set(cacheKey, user.toObject(), { ex: USER_CACHE_TTL_SECONDS });
        console.log(`User ${uid} cached successfully.`);
      } catch (cacheError) {
        console.error("Error writing to Redis cache for user:", cacheError);
        // Don't block the request if caching fails
      }
    }

    // console.log('User after find/create/cache:', user);
    res.json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        bookmarked: user.bookmarked,
        leetcode: user.leetcode,
        credits:user.credits,
      }
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export {handleAuth};