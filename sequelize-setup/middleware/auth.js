// middleware/auth.js
const jwt = require('jsonwebtoken');
const JwtSecret = "ABCD";
const JwtRefresh = "EFGH";
const { verifyToken } = require('../utils/tokens');

const authenticateToken = (req, res, next) => {
  // Get token from header: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  console.log(token)

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  const decoded = verifyToken(token, JwtSecret);
  console.log(decoded)
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach decoded user to request for downstream use
  req.user = decoded;
  next();
};
module.exports = { authenticateToken}