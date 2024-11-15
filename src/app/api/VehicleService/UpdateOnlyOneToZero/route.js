import { connect } from "@config/db.js";
import VehicleService from "@models/VehicleService/VehicleService.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request) => {
  try {
    // Connect to the database
    await connect();

    // Parse the incoming request data (even if it's not used in this case)
    const data = await request.json();
    console.log("Received Data:", data);
    const { registrationNumber } = data;

    if (!registrationNumber) {
      return NextResponse.json(
        { error: "Registration number is required", success: false },
        { status: 400 }
      );
    }

    // Find the most recent record where motPending_Done is 1
    const latestRecord = await VehicleService.findOne({
      servicePending_Done: "1",
      registrationNumber: registrationNumber,
    }).sort({
      createdAt: -1,
    });

    console.log("Latest Record:", latestRecord);

    // Check if no record is found
    if (!latestRecord) {
      return NextResponse.json(
        {
          error: "No record found with servicePending_Done = 1",
          success: false,
        },
        { status: 404 }
      );
    }

    // Update the found record to set motPending_Done to "0"
    latestRecord.servicePending_Done = "0";
    await latestRecord.save();

    return NextResponse.json(
      { message: "Latest record updated successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating servicePending_Done field:", error);
    return NextResponse.json(
      { error: "Failed to update the latest record", success: false },
      { status: 500 }
    );
  }
};
