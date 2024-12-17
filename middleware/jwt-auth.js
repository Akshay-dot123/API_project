// const jwt = require("jsonwebtoken");
// module.exports = authenticateJWT = (req, res, next) => {
//   //   const tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "Authorization";
//   // const token = req.header(tokenHeaderKey);
//   const jwtSecretKey = process.env.SECRET_KEY;
//   const token = req.headers.authorization;
//   console.log("JWT_AUTH middleware===============>", token);
//   if (!token) {
//     return res.status(401).send("Access Denied: No token provided");
//   }
//   try {
//     const verified = jwt.verify(token.split(" ")[1], jwtSecretKey);
//     req.user = verified;
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return res.status(401).send("Invalid token");
//   }
// };

const jwt = require("jsonwebtoken");
const tokenBlacklist = new Set();
const jwtSecretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }
    const bearerToken = token.split(" ");
    // if (bearerToken.length !== 2 || bearerToken[0] !== "Bearer") {
    //   return res.status(403).send({ message: "Invalid token format!" });
    // }
    const actualToken = bearerToken[1];
    if (tokenBlacklist.has(actualToken)) {
      return res.status(401).send({ message: "Token is invalidated. Please Login again." });
    }
    const verified = jwt.verify(actualToken, jwtSecretKey);
    req.user = verified;
    next(); 
  } catch (error) {
    return res.status(401).send({ message: error.message + " Auth error" });
  }
};
const invalidateToken = async (token) => {
  tokenBlacklist.add(token);
};
module.exports = { verifyToken, invalidateToken };
