import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../Mailtrap/email";
import fs from "fs";

// SIGN UP
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("Request Recived!!!");

    console.log(req.body);
    const { fullname, email, password, contact } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    await sendVerificationEmail(email, verificationCode);

    user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      contact: Number(contact),
      verificationToken: verificationCode,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    generateToken(res, user);

    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    } else if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User not Verified!",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password!",
      });
    }

    generateToken(res, user);
    user.lastLogin = new Date();
    await user.save();

    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.fullname}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Resend Verify password
export const resendEmailVerification = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body?._id);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
      });
    }

    const verificationCode = generateVerificationCode();

    user.verificationToken = verificationCode;
    user.verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    user.save();

    await sendVerificationEmail(user.email, verificationCode);

    return res.status(201).json({
      message: "OTP send on your email!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Err+ 24 * 60 * 60 * 1000or!" });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { verificationCode } = req.body;

    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.fullname);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  try {
    return res.clearCookie("token").status(200).json({
      success: true,
      message: "Logout successful!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    console.log("Forgot Password");

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const resetToken = crypto.randomBytes(40).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    );

    return res.status(200).json({
      success: true,

      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// CHECK AUTH
export const checkAuth = async (req: Request, res: Response) => {
  console.log("Check-auth request recived");
  
  try {
    console.log("Request Recived");
    
    const userId = req.id; // Assuming middleware attaches user ID to req
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req: Request, res: Response) => {
  try {
    console.log("Update Route Request...");

    const userId = req.body._id;
    const { fullname, email, address, city, country } = req.body;
    const profilePictureFile = req.file;

    if (!userId) {
      return res.status(404).json({ message: "User id does not exist!" });
    }

    const user = await User.findById(userId);

    let oldProfilePicture = user?.profilePicture;

    let cloudResponse: any;
    if (profilePictureFile) {
      cloudResponse = await cloudinary.uploader.upload(profilePictureFile.path);
      fs.unlinkSync(profilePictureFile.path);
    }

    if (profilePictureFile && !cloudResponse.secure_url) {
      return res
        .status(400)
        .json({ message: "Error while uploading on cloudinary!" });
    }

    if (oldProfilePicture) {
      const regex = /upload\/(?:v\d+\/)?([^\.]+)/;
      const match = oldProfilePicture.match(regex);

      const publicId = match ? match[1] : null;

      if (publicId) {
        const response = await cloudinary.uploader.destroy(publicId);

        if (response.result !== "ok"  && response.result !== "not found") {
          return res.status(400).json({ message: "Error ocuured!!" });
        }
      }
    }

    const updateData: any = {
      fullname,
      email,
      address,
      city,
      country,
    };

    if (cloudResponse?.secure_url) {
      updateData.profilePicture = cloudResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
