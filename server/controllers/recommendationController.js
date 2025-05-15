import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
import recommendProblems from '../utils/recommendProblems.js';
export const createRecommendation = async (req, res) => {

    const userId = req.user.id;
    const { problemNumbers, numRecommendations } = req.body;

    try {
        const response = await recommendProblems(problemNumbers, numRecommendations, userId);

        if (response.error) {
            return res.status(400).json({ error: response.error });
        }
        const { recommendedProblems } = response;

        const formattedRecommendations = recommendedProblems.map(problem => ({
            recommendedProblemNumber: problem.recommendedProblemNumber,
            title: problem.title,
            titleSlug: problem.titleSlug,
            difficulty: problem.difficulty,
            usedProblemNumbers: problem.usedProblemNumbers,
        }));
        // // Create a new recommendation document
        const recommendationDoc = new Recommendation({
            recommendations: formattedRecommendations,
            createdAt: new Date()
        });

        console.log("Recommendation document:", recommendationDoc);
        // // Save the recommendation document
        const savedRecommendation = await recommendationDoc.save();

        // // Update the user's recommendation history
        await User.findByIdAndUpdate(
            userId,
            { $push: { recommendationHistory: savedRecommendation._id } },
            { new: true }
        );

        return res.status(200).json({
            message: 'Recommendation created successfully',
            recommendationId: savedRecommendation._id,
            recommendations: formattedRecommendations
        });

    } catch (error) {
        console.error("Error creating recommendation:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }


}

//----------- Get all recommendations for a user
export const getAllRecommendations = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate({
            path: 'recommendationHistory',
            select: 'recommendations createdAt' // only get recommendations array and createdAt
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Transform the data
        const formatted = user.recommendationHistory.map(rec => ({
            id: rec._id,
            count: rec.recommendations.length,
            date: rec.createdAt
        }));

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
