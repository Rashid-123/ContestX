import User from '../models/User.js';

import axios from 'axios';
// Generic function to update a specific field
// export const integrate_Leetcode = async (req, res) => {

//   console.log("In updateUserField function");

//   try {
//     const userId = req.user.id;
//     const value = req.body.username;
//     console.log("User ID:", userId);

//     if (!value) {
//       return res.status(400).json({ message: "leetcode username is required." });
//     }

//     console.log("Value to update:", value);

//     const user = await User.findByIdAndUpdate(
//       userId, 
//       { leetcode: value },
//       { new: true }
//     );

//     console.log("User after update:", user);

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     } 
//     console.log("User found:", user);
//     res.status(200).json({
//       message: `leetcode username updated successfully.`,
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error.", error: error.message });
//   }
// };





// Helper function to validate LeetCode username
const validateLeetCodeUsername = async (username) => {
  try {
    // GraphQL query to check if user exists
    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              realName
              userAvatar
              ranking
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
        }
      `,
      variables: {
        username: username
      }
    };

    const response = await axios.post('https://leetcode.com/graphql/', query, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://leetcode.com'
      },
      timeout: 10000 // 10 second timeout
    });

    // Check if user exists
    const userData = response.data?.data?.matchedUser;
    
    if (!userData || !userData.username) {
      return {
        isValid: false,
        error: 'Username not found on LeetCode'
      };
    }

    // Additional validation - check if user has any activity
    const hasActivity = userData.submitStats?.acSubmissionNum?.some(stat => stat.count > 0);
    
    return {
      isValid: true,
      userData: {
        username: userData.username,
        realName: userData.profile?.realName,
        avatar: userData.profile?.userAvatar,
        ranking: userData.profile?.ranking,
        hasActivity: hasActivity
      }
    };

  } catch (error) {
    console.error('LeetCode validation error:', error.message);
    
    // Handle specific error cases
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        isValid: false,
        error: 'Unable to connect to LeetCode. Please try again later.'
      };
    }
    
    if (error.response?.status === 429) {
      return {
        isValid: false,
        error: 'Too many requests. Please try again in a few minutes.'
      };
    }

    return {
      isValid: false,
      error: 'Unable to validate username. Please try again.'
    };
  }
};



// Helper function for basic username format validation
const isValidUsernameFormat = (username) => {
  // LeetCode usernames: 1-15 characters, alphanumeric, underscore, hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]{1,15}$/;
  return usernameRegex.test(username);
};

export const integrate_Leetcode = async (req, res) => {
  console.log("In integrate_Leetcode function");

  try {
    const userId = req.user.id;
    const username = req.body.username;
    
    console.log("User ID:", userId);
    console.log("Input value:", username);

    // Basic validation
    if (!username || username.trim() === '') {
      return res.status(400).json({ 
        message: "LeetCode username is required." 
      });
    }

    // Format validation
    if (!isValidUsernameFormat(username)) {
      return res.status(400).json({ 
        message: "Invalid username format. Username should be 1-15 characters long and contain only letters, numbers, underscores, and hyphens." 
      });
    }

    // Validate with LeetCode API
    console.log("Validating username with LeetCode...");
    const validation = await validateLeetCodeUsername(username);

    if (!validation.isValid) {
      return res.status(400).json({ 
        message: validation.error || "Invalid LeetCode username." 
      });
    }

    console.log("Username validated successfully:", validation.userData);

    // Update user in database
    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        leetcode: username,
        // Optionally store additional LeetCode data
        leetcodeData: {
          realName: validation.userData.realName,
          avatar: validation.userData.avatar,
          ranking: validation.userData.ranking,
          hasActivity: validation.userData.hasActivity,
          lastValidated: new Date()
        }
      },
      { new: true }
    );

    console.log("User after update:", user);

    if (!user) {
      return res.status(404).json({ 
        message: "User not found." 
      });
    }

    res.status(200).json({
      message: "LeetCode username updated successfully.",
      user,
      leetcodeProfile: validation.userData
    });

  } catch (error) {
    console.error("Server error in integrate_Leetcode:", error);
    res.status(500).json({ 
      message: "Server error occurred while updating LeetCode username.", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
