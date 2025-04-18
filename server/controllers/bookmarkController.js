import User from "../models/user.js";

export const addBookmark = async (req, res) => {
    try {
        
      const { contestCode } = req.body;
      const userId = req.user.id;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { bookmarks: contestCode } },
        { new: true }
      );
  
      if (!user) return res.status(404).json({ error: "User not found" });
  
      return res.status(200).json({ message: "Bookmark added", bookmarks: user.bookmarks });
    } catch (error) {
      console.error("Error adding bookmark:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  

export const deleteBookmark = async (req, res) => {
    try {
        const { contestCode } = req.body; // Extract contestCode from request body
        const userId = req.user.id; // Get user ID from the request object
    
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
    
        // Remove the contest code from the user's bookmarks array
        user.bookmarks = user.bookmarks.filter(code => code !== contestCode);
        await user.save();
    
        return res.status(200).json({ message: "Bookmark deleted successfully", bookmarks: user.bookmarks });
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getallBookmarks = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the request object  
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const bookmarks = user.bookmarks;
        return res.status(200).json({ bookmarks });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
   
}

