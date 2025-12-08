import OtpModel from "../models/Otp";
import crypto from "crypto";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from "../models/User";
import { Farmer } from "../models/Farmer";


//sendOTP
export const generateOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP in DB (old OTP for same number gets deleted automatically by TTL)
    await OtpModel.create({
      phoneNumber,
      otp,
    });

    // TODO: Integrate SMS Gateway (Twilio, MSG91, etc.)
    console.log(`OTP for ${phoneNumber} = ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      phoneNumber,
      otp
    });

  } catch (error: any) {
    console.error("OTP generation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//verify-otp 
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // Find OTP for this phone number
    const existingOtp = await OtpModel.findOne({ phoneNumber });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    // Compare OTP
    if (existingOtp.otp.toString() !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP matched → delete OTP from DB
    await OtpModel.deleteOne({ phoneNumber });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      phoneNumber,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//sign in or sign up 
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      role,
      addressDetail,
      farmerProfile
    } = req.body;

    // Validation
    if (!firstName || !lastName || !phoneNumber || !role || !addressDetail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (
      !addressDetail.line1 ||
      !addressDetail.state ||
      !addressDetail.district ||
      !addressDetail.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Address details are incomplete",
      });
    }

     if (role === "farmer") {
      if (
        !farmerProfile ||
        !farmerProfile.totalLandHolding ||
        !farmerProfile.hedgingExperience ||
        !farmerProfile.educationLevel ||
        !farmerProfile.crops
      ) {
        return res.status(400).json({
          success: false,
          message: "Farmer profile details are incomplete"
        });
      }
    }


    // Check existing user
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      role,
      profileImage:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}%20${lastName}`,
      addressDetail,
    });
 

        // Create farmer profile only if role is farmer
    if (role === "farmer") {
      await Farmer.create({
        user: newUser._id,
        totalLandHolding: farmerProfile.totalLandHolding,
        crops: farmerProfile.crops,
        hedgingExperience: farmerProfile.hedgingExperience,
        educationLevel: farmerProfile.educationLevel,
        digitalLiteracy: "medium",   // default
        totalContracts: 0,
        activeContracts: 0,
        walletBalance: 0
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, phoneNumber: newUser.phoneNumber, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // token valid for 7 days
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,            // Return JWT
      user: newUser,    // Return user data
    });

  } catch (error:any) {
    console.error("Create User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:error.message
    });
  }
};

