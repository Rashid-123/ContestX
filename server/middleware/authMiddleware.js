// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      // Extract the token from the Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add the user information to the request object
      req.user = decoded;
      
      // Continue to the actual API handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      
      return res.status(401).json({ error: 'Invalid authentication' });
    }
  };
}