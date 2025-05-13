import User from '../models/User.js';

import recommendProblems from '../recommendProblems.js';
const createRecmmendation = async (req, res) => {

    const userId = req.user.id;
    const {problemNumbers , numRecommendations} = req.body;

    try {
        const response = await recommendProblems(userId, problemNumbers, numRecommendations);
        if (response.error) {
            return res.status(400).json({ error: response.error });
        }
        const { recommendedProblems } = response;
      
    } catch (error) {
        
    }
    

}