import { connect } from "@config/db.js";
import jwt from "jsonwebtoken";
import DriverModel from "@models/Driver/Driver.Model";
import { NextResponse } from "next/server";

export async function POST(Request) {
  try {
    // Establish database connection
    await connect();

    // Parse request body
    const { amount, currentBalance, token } = await Request.json();

    // Validate request fields
    if (amount === undefined || !currentBalance || !token) {
      return NextResponse.json(
        { isSuccess: false, msg: "All fields are required" },
        { status: 400 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { isSuccess: false, msg: "Invalid token" },
        { status: 401 }
      );
    }

    // Find the driver by ID
    const driver = await DriverModel.findById(decoded.userId);
    if (!driver) {
      return NextResponse.json(
        { isSuccess: false, msg: "Driver not found" },
        { status: 404 }
      );
    }

    // Update balance
    const newBalance = parseFloat(currentBalance) + parseFloat(amount);
    driver.balance = newBalance;

    // Save updated balance
    await driver.save();

    // Return updated balance
    return NextResponse.json({
      isSuccess: true,
      msg: "",
      content: { newBalance },
    });
  } catch (error) {
    console.error("Error recording transaction:", error);
    return NextResponse.json(
      { isSuccess: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
