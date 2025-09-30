import User from "../models/User.js";

const otpStorage = new Map();

export const sendOTP = async (phone) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    otpStorage.set(phone, {
      otp,
      otpExpires,
      attempts: 0,
    });

    await User.findOneAndUpdate(
      { phone },
      {
        otp,
        otpExpires,
        isPhoneVerified: false,
      },
      { upsert: true, new: true } // Create user if doesn't exist
    );

    // In development, log OTP to console (FREE!)
    console.log("📱 ==================== OTP DEBUG ====================");
    console.log(`📱 Phone: ${phone}`);
    console.log(`🔢 OTP: ${otp}`);
    console.log(`⏰ Expires: ${otpExpires}`);
    console.log("📱 ==================================================");

    return { success: true, otp }; // Return OTP for testing
  } catch (error) {
    console.error("Send OTP error:", error);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOTP = async (phone, enteredOtp) => {
  try {
    // Check memory first
    const storedOtp = otpStorage.get(phone);
    console.log("PHUU", phone);

    if (storedOtp) {
      if (new Date() > storedOtp.otpExpires) {
        otpStorage.delete(phone);
        return { success: false, message: "OTP has expired" };
      }

      if (storedOtp.otp === enteredOtp) {
        otpStorage.delete(phone);
        return { success: true, message: "OTP verified successfully" };
      } else {
        storedOtp.attempts += 1;
        if (storedOtp.attempts >= 3) {
          otpStorage.delete(phone);
          return { success: false, message: "Too many failed attempts" };
        }
        return { success: false, message: "Invalid OTP" };
      }
    }

    // Fallback to database check
    const user = await User.findOne({
      phone,
      otp: enteredOtp,
      otpExpires: { $gt: new Date() },
    });

    if (user) {
      // Clear OTP after successful verification
      user.otp = undefined;
      user.otpExpires = undefined;
      user.isPhoneVerified = true;
      await user.save();

      return { success: true, message: "OTP verified successfully" };
    }

    return { success: false, message: "Invalid or expired OTP" };
  } catch (error) {
    console.error("Verify OTP error service:", error);
    throw new Error("Failed to verify OTP");
  }
};
