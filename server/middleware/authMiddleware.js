import admin from "firebase-admin";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  // console.log("ID Token:", idToken);

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUID = decodedToken.uid;
// console.log("Decoded token:", decodedToken);
    // Find the user in MongoDB
    const user = await User.findOne({ firebaseUID });
    // console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
       
    req.user = user;
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


