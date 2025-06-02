import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
import recommendProblems from '../utils/recommendProblems.js';
export const createRecommendation = async (req, res) => {
    const userId = req.user._id;
    const { problemNumbers, numRecommendations, Hard, name } = req.body;
    
    console.log('Controller input:', { problemNumbers, numRecommendations, Hard, name });
    
    // Validate and convert input
    if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
        return res.status(400).json({ 
            error: 'Please provide exactly 20 problem numbers as an array' 
        });
    }
    
    // Convert problem numbers to integers if they're strings
    const convertedProblemNumbers = problemNumbers.map(num => {
        const converted = typeof num === 'string' ? parseInt(num, 10) : num;
        if (isNaN(converted)) {
            return res.status(400).json({ 
                error: `Invalid problem number: ${num}` 
            });
        }
        return converted;
    });
    
    console.log('Converted problem numbers:', convertedProblemNumbers);
    
    if (numRecommendations !== 5 && numRecommendations !== 10) {
        return res.status(400).json({ 
            error: 'Number of recommendations must be either 5 or 10' 
        });
    }
    
    const includeHard = Hard === "true" || Hard === true;
    
    try {
        console.log('Calling recommendProblems with:', {
            problemNumbers: convertedProblemNumbers,
            numRecommendations,
            includeHard
        });
        
        // Add timeout to catch hanging requests
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout after 60 seconds')), 60000)
        );
        
        const recommendationPromise = recommendProblems(convertedProblemNumbers, numRecommendations, includeHard);
        
        const response = await Promise.race([recommendationPromise, timeoutPromise]);
        
        console.log('Recommendation service response:', response);
        
        if (response.error) {
            console.error('Recommendation service error:', response.error);
            return res.status(400).json({ 
                error: response.error,
                details: response.details 
            });
        }
        
        const { recommendedProblems } = response;
        
        if (!recommendedProblems || !Array.isArray(recommendedProblems)) {
            console.error('Invalid response format from recommendation service:', response);
            return res.status(500).json({ 
                error: 'Invalid response from recommendation service' 
            });
        }
        
        const formattedRecommendations = recommendedProblems.map(problem => ({
            recommendedProblemNumber: problem.recommendedProblemNumber,
            title: problem.title,
            titleSlug: problem.titleSlug,
            difficulty: problem.difficulty,
            usedProblemNumbers: problem.usedProblemNumbers,
            message: problem.message
        }));
        
        // Create a new recommendation document
        const recommendationDoc = new Recommendation({
            recommendations: formattedRecommendations,
            name: name,
            createdAt: new Date()
        });
        
        console.log("Creating recommendation document:", recommendationDoc);
        
        // Save the recommendation document
        const savedRecommendation = await recommendationDoc.save();
        console.log("Saved recommendation:", savedRecommendation._id);
        
        // Update the user's recommendation history
     const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
        $push: { recommendationHistory: savedRecommendation._id },
        $inc: { credits: -numRecommendations }
    },
    { new: true }
);
        
        return res.status(200).json({
            message: 'Recommendation created successfully',
            recommendationId: savedRecommendation._id,
            recommendations: formattedRecommendations,
            name: name,
            createdAt: savedRecommendation.createdAt,
            credits:updatedUser.credits
        });
        
    } catch (error) {
        console.error("Error creating recommendation:", error);
        
        // More specific error handling
        if (error.message.includes('timeout')) {
            return res.status(408).json({ 
                error: 'Request timeout - recommendation service took too long' 
            });
        }
        
        if (error.message.includes('PINECONE') || error.message.includes('Pinecone')) {
            return res.status(503).json({ 
                error: 'Vector database service unavailable' 
            });
        }
        
        if (error.message.includes('OpenAI') || error.message.includes('openai')) {
            return res.status(503).json({ 
                error: 'AI service unavailable' 
            });
        }
        
        return res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
//----------- Get all recommendations for a user

export const getAllRecommendations = async (req, res) => {
    // console.log("Get all recommendations called");
    const userId = req.user._id;
 console.log("User ID:", userId);
    try {
        const user = await User.findById(userId).populate({
            path: 'recommendationHistory',
            options: { sort: { createdAt: -1 } }
         });
//   console.log("User with recommendations:", user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Transform the data
        const formatted = user.recommendationHistory.map(rec => ({
            id: rec._id,
            count: rec.recommendations.length,
            name: rec.name,
            date: rec.createdAt
        }));
    // console.log("Formatted recommendations:", formatted);
        return res.status(200).json({
            message: 'Recommendations retrieved successfully',
            recommendations: formatted
        });
    } catch (error) {
        console.error("Error retrieving recommendations:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//------------- Get a specific recommendation by ID
export const getRecommendation = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const recommendation = await Recommendation.findById(id);

        if (!recommendation) {
            return res.status(404).json({ error: 'Recommendation not found' });
        }

        // Check if the recommendation belongs to the user
        const user = await User.findById(userId);
        if (!user || !user.recommendationHistory.includes(id)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        return res.status(200).json({
            message: 'Recommendation retrieved successfully',
            recommendation
        });
    } catch (error) {
        console.error("Error retrieving recommendation:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
