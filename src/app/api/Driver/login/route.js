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
    const {  DriverUserName, password } = await Request.json();

    console.log(DriverUserName, password)

    // Validate required fields
    if (!DriverUserName || !password) {
      return NextResponse.json({ 
        message: "DriverUserName and Password are required", 
        status: 400 
      });
    }

    // Find driver by DriverId and CompanyId
    const user = await DriverModel.findOne({firstName: DriverUserName});
    console.log(user)
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
        name: user.firstName + user.lastName,
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
        name: user.firstName + user.lastName,
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
