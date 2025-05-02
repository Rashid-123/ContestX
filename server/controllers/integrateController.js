import User from '../models/user.js';

// Generic function to update a specific field
const updateUserField = async (req, res, field) => {

  console.log("In updateUserField function");

  try {
    const userId = req.user.id;
    const value = req.body.username;
    console.log("User ID:", userId);

    if (!value) {
      return res.status(400).json({ message: `${field} username is required.` });
    }

    console.log("Value to update:", value);

    const user = await User.findByIdAndUpdate(
      userId, 
      { [field]: value },
      { new: true }
    );

    console.log("User after update:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: `${field} username updated successfully.`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const integrate_Leetcode = (req, res) => {
  return updateUserField(req, res, "leetCode");
};

export const integrate_Github = (req, res) => {
  return updateUserField(req, res, "github");
};

