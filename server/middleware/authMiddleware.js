import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-otp -otpExpires");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid - user not found",
      });
    }

    // // Check if phone is verified
    // if (!user.isPhoneVerified) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Phone number not verified",
    //   });
    // }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
