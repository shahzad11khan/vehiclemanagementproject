// middleware.js
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET; // Make sure to set your JWT secret in environment variables

export default function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming "Bearer <token>"
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    // Token is valid, you can attach the decoded payload to the request object
    req.user = decoded; // Attach the decoded user info to the request

    // console.log(req.user);
    next(); // Call the next middleware or route handler
  });
}
