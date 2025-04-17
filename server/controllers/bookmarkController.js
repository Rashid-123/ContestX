import User from "../models/user";
import mongoose from "mongoose";

const addbookmark = async (req, res) => {
    try {
        const { contestCode } = req.body; // Extract contestCode from request body
        const userId = req.user.id; // Get user ID from the request object
    
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }
    
        // Add the contest code to the user's bookmarks array
        user.bookmarks.push(contestCode);
        await user.save();
    
        return res.status(200).json({ message: "Bookmark added successfully", bookmarks: user.bookmarks });
    } catch (error) {
        console.error("Error adding bookmark:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}