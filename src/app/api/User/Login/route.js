import { connect } from "@config/db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "@models/User/User.Model.js";
import Company from "@models/Company/Company.Model";
import { NextResponse } from "next/server";

export async function POST(Request) {
  try {
    // Establish database connection
    await connect();

    const { email, password } = await Request.json();
    if (!email || !password) return NextResponse.json({ message: "Email and Password are required" });
    let user = await User.findOne({
      $and: [{ email: email }, { confirmpassword: password }]
    }).exec();
    if ((!user)) {
      const isCompany = await Company.findOne({ email: email  });
      if (!isCompany) {
        return NextResponse.json({
          message: "Email Incorrect",
        });
      } else {
          user = isCompany;
      }
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({
        message: "Password Incorrect"
      });
    }
    // Generate JWT token with appropriate user data
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        company: user.companyname || user.CompanyName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1y", // Adjust token expiration as needed
      }
    );

    // Create a response object with user data and token
    const response = NextResponse.json({
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
      company: user.companyname || user.CompanyName,
      companyId: user._id,
      role: user.role,
      isActive: user.isActive,
      message: "Login successfully",
      status: 200,
    });

    // Set the token cookie with HttpOnly flag
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
