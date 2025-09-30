import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendOTP, verifyOTP } from "../service/otpService.js";

// Send OTP for login/signup
export const sendLoginOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Create temporary user with only phone (name/email optional)
    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({
        phone: phone,
        name: `User${phone.slice(-4)}`, // Temporary name
        email: "", // Empty email initially
        profileCompleted: false,
      });
      await user.save();
    }

    // Send OTP
    const result = await sendOTP(phone);

    res.json({
      success: true,
      message: "OTP sent successfully",
      debugOtp: result.otp,
      isNewUser: !user.profileCompleted,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
};

// Verify OTP and return token (profile may be incomplete)
export const verifyLoginOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    // Verify OTP
    const verification = await verifyOTP(phone, otp);

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    // Find user
    let user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Update verification status
    user.isPhoneVerified = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || "fallback_secret_for_development",
      { expiresIn: "5d" }
    );

    res.json({
      success: true,
      message: user.profileCompleted
        ? "Login successful"
        : "Please complete your profile",
      token,
      userId: user._id, // Send user ID directly
      user: {
        id: user._id,
        phone: user.phone,
      },
      requiresProfileCompletion: !user.profileCompleted,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify OTP",
    });
  }
};

export const completeProfile = async (req, res) => {
  console.log("CompleteProfile");
  console.log("reqqqqq", req.body);

  try {
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "User ID, name and email are required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user profile
    user.name = name;
    user.email = email;
    user.profileCompleted = true;
    await user.save();

    // Generate new token with updated user info
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || "fallback_secret_for_development",
      { expiresIn: "5d" }
    );

    res.json({
      success: true,
      message: "Profile completed successfully",
      token, // Return new token
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isPhoneVerified: user.isPhoneVerified,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to complete profile",
    });
  }
};
