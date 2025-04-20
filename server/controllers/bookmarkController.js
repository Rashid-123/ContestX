import User from "../models/user.js";

export const toggleBookmark = async (req, res) => {
    try {
        const { contestCode } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const alreadyBookmarked = user.bookmarks.includes(contestCode);

        if (alreadyBookmarked) {
            // Remove bookmark
            user.bookmarks = user.bookmarks.filter(code => code !== contestCode);
            await user.save();
            return res.status(200).json({ message: "Bookmark removed", bookmarks: user.bookmarks });
        } else {
            // Add bookmark
            user.bookmarks.push(contestCode);
            await user.save();
            return res.status(200).json({ message: "Bookmark added", bookmarks: user.bookmarks });
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

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

