const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed: No token provided" });
  }

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Authentication failed: Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = authenticateToken;
