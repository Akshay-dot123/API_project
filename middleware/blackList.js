// const checkBlacklist = (req, res, next) => {
//     const token = req.headers.authorization.split(" ")[1];
//     console.log("CheckBlackList 1 ============>", token);
//     if (blacklist.has(token)) {
//       console.log("CheckBlackList 2 ============>", token);
//       return res.status(401).send("Token has been invalidated");
//     }
//     next();
//   };