import { connect } from "../../../../../config/db.js";
import VehicleType from "../../../../../models/VehicleType/VehicleType.Model.js";
import { catchAsyncErrors } from "../../../../../middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a VehicleType by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.VehicleTypeID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive } = formDataObject;

  // Find the vehicle by ID
  const VehicleType = await VehicleType.findById(id);

  if (!VehicleType) {
    return NextResponse.json({ error: "VehicleType not found", status: 404 });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  VehicleType.name = name ? name.trim() : VehicleType.name; // Update name or retain existing
  VehicleType.description = description
    ? description.trim()
    : VehicleType.description; // Update description or retain existing
  VehicleType.isActive = isActive ? isActive : VehicleType.isActive;

  // Save the updated vehicle
  await VehicleType.save();

  return NextResponse.json({
    message: "VehicleType details updated successfully",
    VehicleType,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.VehicleTypeID;
  console.log(id);

  // Find the driver by ID
  const Find_VehicleType = await VehicleType.findById(id);

  // Check if the driver exists
  if (!Find_VehicleType) {
    return NextResponse.json({ result: "No VehicleType Found", status: 404 });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_VehicleType, status: 200 });
});

export const DELETE = catchAsyncErrors(async (request, { params }) => {
  await connect();

  const id = params.VehicleTypeID;
  console.log("Driver ID:", id);
  const deletedVehicleType = await Vehicle.findOneAndDelete({
    id,
  });
  if (!deletedVehicleType) {
    return NextResponse.json({
      message: "VehicleType not found",
      status: 404,
    });
  }

  return NextResponse.json({
    message: "VehicleType deleted successfully",
    success: true,
    status: 200,
  });
});
