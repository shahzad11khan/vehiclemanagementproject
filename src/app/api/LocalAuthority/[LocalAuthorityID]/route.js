import { connect } from "../../../../../config/db.js";
import LocalAuthority from "../../../../../models/LocalAuthority/LocalAuthority.Model.js";
import { catchAsyncErrors } from "../../../../../middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a LocalAuthority by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.LocalAuthorityID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive } = formDataObject;

  // Find the vehicle by ID
  const localAuthority = await LocalAuthority.findById(id);

  if (!localAuthority) {
    return NextResponse.json({
      error: "LocalAuthority not found",
      status: 404,
    });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  localAuthority.name = name ? name.trim() : localAuthority.name; // Update name or retain existing
  localAuthority.description = description
    ? description.trim()
    : localAuthority.description; // Update description or retain existing
  localAuthority.isActive = isActive ? isActive : localAuthority.isActive;

  // Save the updated vehicle
  await localAuthority.save();

  return NextResponse.json({
    message: "LocalAuthority details updated successfully",
    LocalAuthority,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.LocalAuthorityID;
  console.log(id);

  // Find the driver by ID
  const Find_LocalAuthority = await LocalAuthority.findById(id);

  // Check if the driver exists
  if (!Find_LocalAuthority) {
    return NextResponse.json({
      result: "No LocalAuthority Found",
      status: 404,
    });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_LocalAuthority, status: 200 });
});

export const DELETE = catchAsyncErrors(async (request, { params }) => {
  await connect();

  const id = params.LocalAuthorityID;
  console.log("Driver ID:", id);
  const deletedLocalAuthority = await Vehicle.findOneAndDelete({
    id,
  });
  if (!deletedLocalAuthority) {
    return NextResponse.json({
      message: "LocalAuthority not found",
      status: 404,
    });
  }

  return NextResponse.json({
    message: "LocalAuthority deleted successfully",
    success: true,
    status: 200,
  });
});
