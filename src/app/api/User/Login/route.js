// import { connect } from "@config/db.js";
// import jwt from "jsonwebtoken";
// import bcryptjs from "bcryptjs";
// import User from "@models/User/User.Model.js";
// import Company from "@models/Company/Company.Model";
// import { NextResponse } from "next/server";

// export async function POST(Request) {
//   try {
//     // Establish database connection
//     await connect();

//     // Extract email and password from request body
//     const { email, password } = await Request.json();
//     console.log(email, password);

//     // Validate JSON structure or required fields here (optional)

//     // Attempt to find user by email in User model
//     let user = null; // Initialize user as null

//     // Attempt to find the user in the User model
//     user = await User.findOne({ email }).exec();

//     // console.log("user table", user);

//     // If not found in User model, check Company model
//     if (!user) {
//       user = await Company.findOne({ email }).exec();
//       // console.log("company table", user);
//     }

//     // console.log(password, user.password);

//     // Handle missing credentials or invalid email
//     if (!user) {
//       return NextResponse.json({
//         error: "Invalid credentials",
//         status: 401,
//       });
//     }

//     // Validate password using bcrypt
//     const isPasswordValid = await bcryptjs.compare(password, user.password);
//     console.log(isPasswordValid);

//     if (!isPasswordValid) {
//       return NextResponse.json({
//         error: "Invalid credentials",
//         status: 401,
//       });
//     }

//     // Generate JWT token with appropriate user data
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         username: user.username,
//         email: user.email,
//         company: user.companyname || user.CompanyName,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1y", // Adjust token expiration as needed
//       }
//     );

//     // Create a response object with user data and token
//     const response = NextResponse.json({
//       token,
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       company: user.companyname || user.CompanyName,
//       role: user.role,
//       isActive: user.isActive,
//       message: "Login successful",
//       status: 200,
//     });

//     // Set the token cookie with HttpOnly flag
//     response.cookies.set("token", token, {
//       httpOnly: true,
//     });

//     return response;
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal server error", status: 500 });
//   }
// }
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

    // Extract email and password from request body
    const { email, password } = await Request.json();
    console.log(email, password);

    // Attempt to find user by email in User model
    let user = null; // Initialize user as null

    // Check User model first
    user = await User.findOne({ email }).exec();

    // If not found in User model, check Company model
    let isCompany = false;
    if (!user) {
      user = await Company.findOne({ email }).exec();
      isCompany = !!user; // Set isCompany flag if found in Company model
    }

    console.log(user);

    // If user not found in either User or Company models
    if (!user) {
      return NextResponse.json({
        error: "Invalid credentials",
        status: 401,
      });
    }

    // If the user is from the Company model but has no password field, handle it
    if (isCompany && !user.password) {
      return NextResponse.json({
        error: "Company does not have a password set",
        status: 401,
      });
    }

    // Validate password using bcryptjs
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({
        error: "Invalid credentials",
        status: 401,
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
      role: user.role,
      isActive: user.isActive,
      message: "Login successful",
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
