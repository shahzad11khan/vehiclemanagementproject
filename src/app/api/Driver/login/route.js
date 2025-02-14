import { connect } from "@config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import DriverModel from "@models/Driver/Driver.Model";

export async function POST(Request) {
  try {
    // Establish database connection
    await connect();

    // Extract data from the request body
    const { CompanyId, DriverId, password } = await Request.json();

    // Validate required fields
    if (!CompanyId || !DriverId || !password) {
      return NextResponse.json({ 
        message: "CompanyId, DriverId, and Password are required", 
        status: 400 
      });
    }

    // Find driver by DriverId and CompanyId
    const user = await DriverModel.findOne({ _id: DriverId, companyId: CompanyId });
    if (!user) {
      return NextResponse.json({
        message: "Driver not found",
        status: 404,
      });
    }

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        message: "Password Incorrect",
        status: 401,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        company: user.companyId,
        isActive: user.isActive,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1y", // Token expiration time
      }
    );

    // Create response with token and user details
    const response = NextResponse.json({
      isSuccess: true,
      msg: "Login successfully",
      content: {
        name: user.name,
        balance: user.balance || 0,
        token: token,
      },
    });

    // Set the token as a cookie (secure and HttpOnly)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set `secure` in production
      sameSite: "strict", // Helps prevent CSRF attacks
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Internal server error",
      status: 500,
    });
  }
}
