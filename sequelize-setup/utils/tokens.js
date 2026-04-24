// utils/token.js
const jwt = require('jsonwebtoken');
const JwtSecret = "ABCD";
const JwtRefresh = "EFGH";
/**
 * Generate access + refresh tokens for a user
 * @param {Object} user - User object with id and email
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      email: user.email 
      // ⚠️ Keep payload minimal - it's base64, NOT encrypted
    },
    JwtSecret,
    { expiresIn: '11h' }
  );
   const decoded = jwt.decode(accessToken);
  console.log('=== NEW TOKEN CREATED ===');
  console.log('Issued at:', new Date(decoded.iat * 1000));
  console.log('Expires at:', new Date(decoded.exp * 1000));
  console.log('Hours until expiry:', (decoded.exp - decoded.iat) / 3600);

  const refreshToken = jwt.sign(
    { userId: user.id },
    JwtRefresh,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};
const verifyToken = (token, secret) => {
  try {
    console.log("++++++++++++++++++++++++++++++++++++++","_______________")
    // return jwt.verify(token, secret);
    const decoded = jwt.verify(token, secret);
    console.log(decoded,"88888888888888")
    return decoded;
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return null;
  }
};

module.exports = { generateTokens, verifyToken };