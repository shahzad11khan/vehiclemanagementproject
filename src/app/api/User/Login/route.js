import { connect } from "@config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "@models/User/User.Model.js";
import { NextResponse } from "next/server";

export async function POST(Request) {
  try {
    await connect();
    const { email, password } = await Request.json();
    console.log(email, password);
    // Validate the JSON structure or required fields here if needed

    // Find user by email
    const user = await User.findOne({ email }).exec();

    // Check if user exists
    if (!user) {
      return NextResponse.json({
        error: "Invalid credentials",
        status: 401,
      });
    }
    console.log("User Exits");

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({
        error: "Invalid credentials",
        status: 401,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        company: user.companyname,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1y", // Token expires in 1 hour
      }
    );

    const response = NextResponse.json({
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
      company: user.companyname,
      role: user.role,
      isActive: user.isActive,
      message: "Login successful",
      status: 200,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
