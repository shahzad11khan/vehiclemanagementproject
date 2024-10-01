import { connect } from "@config/db.js";
import Insurence from "@models/Insurence/Insurence.model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a Insurence by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.InsurenceID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    formDataObject;

  // Find the vehicle by ID
  const insurence = await Insurence.findById(id);

  if (!insurence) {
    return NextResponse.json({
      error: "Insurence not found",
      status: 404,
    });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  insurence.name = name ? name.trim() : insurence.name; // Update name or retain existing
  insurence.description = description
    ? description.trim()
    : insurence.description; // Update description or retain existing
  insurence.isActive = isActive ? isActive : insurence.isActive;
  insurence.adminCreatedBy = adminCreatedBy
    ? adminCreatedBy
    : insurence.adminCreatedBy;
  insurence.adminCompanyName = adminCompanyName
    ? adminCompanyName
    : insurence.adminCompanyName;

  // Save the updated vehicle
  await insurence.save();

  return NextResponse.json({
    message: "Insurence details updated successfully",
    Insurence,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.InsurenceID;
  console.log(id);

  // Find the driver by ID
  const Find_Insurence = await Insurence.findById(id);

  // Check if the driver exists
  if (!Find_Insurence) {
    return NextResponse.json({
      result: "No Insurence Found",
      status: 404,
    });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Insurence, status: 200 });
});

// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { InsurenceID } = params; // Access the ManufacturerID from params

    console.log("Insurence ID:", InsurenceID);

    // Find and delete the manufacturer
    const deletedInsurence = await Insurence.findByIdAndDelete(InsurenceID);

    if (!deletedInsurence) {
      return NextResponse.json({
        error: "Insurence not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Insurence deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Insurence:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the Insurence",
      status: 500,
    });
  }
};
