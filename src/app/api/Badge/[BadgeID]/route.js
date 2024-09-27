import { connect } from "@config/db.js";
import Badge from "@models/Badge/Badge.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a badge by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.BadgeID; // Extract VehicleID from params
  const data = await request.json(); // Get the form data

  // Destructure the necessary fields
  const { name, description, isActive } = data;

  // Find the vehicle by ID
  const badge = await Badge.findById(id);

  if (!badge) {
    return NextResponse.json({ error: "badge not found", status: 404 });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  badge.name = name ? name.trim() : badge.name; // Update name or retain existing
  badge.description = description ? description.trim() : badge.description; // Update description or retain existing
  badge.isActive = isActive ? isActive : badge.naisActiveme;

  // Save the updated vehicle
  await badge.save();

  return NextResponse.json({
    message: "badge details updated successfully",
    badge,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.BadgeID;
  console.log(id);

  // Find the driver by ID
  const Find_Badge = await Badge.findById(id);

  // Check if the driver exists
  if (!Find_Badge) {
    return NextResponse.json({ result: "No Badge Found", status: 404 });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Badge, status: 200 });
});

// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { BadgeID } = params; // Access the ManufacturerID from params

    console.log("Badge ID:", BadgeID);

    // Find and delete the manufacturer
    const deletedBadge = await Badge.findByIdAndDelete(BadgeID);

    if (!deletedBadge) {
      return NextResponse.json({
        error: "Badge not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Badge deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Badge:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the Badge",
      status: 500,
    });
  }
};
