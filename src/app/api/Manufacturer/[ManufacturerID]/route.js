import { connect } from "@config/db.js";
import Manufecturer from "@models/Manufecturer/Manufecturer.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a Manufecturer by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.ManufecturerID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive } = formDataObject;

  // Find the vehicle by ID
  const manufecturer = await Manufecturer.findById(id);

  if (!manufecturer) {
    return NextResponse.json({
      error: "Manufecturer not found",
      status: 404,
    });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  manufecturer.name = name ? name.trim() : manufecturer.name; // Update name or retain existing
  manufecturer.description = description
    ? description.trim()
    : manufecturer.description; // Update description or retain existing
  manufecturer.isActive = isActive ? isActive : manufecturer.isActive;

  // Save the updated vehicle
  await manufecturer.save();

  return NextResponse.json({
    message: "Manufecturer details updated successfully",
    Manufecturer,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.ManufecturerID;
  console.log(id);

  // Find the driver by ID
  const Find_Manufecturer = await Manufecturer.findById(id);

  // Check if the driver exists
  if (!Find_Manufecturer) {
    return NextResponse.json({
      result: "No Manufecturer Found",
      status: 404,
    });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Manufecturer, status: 200 });
});

// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { ManufacturerID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", ManufacturerID);

    // Find and delete the manufacturer
    const deletedManufacturer = await Manufecturer.findByIdAndDelete(
      ManufacturerID
    );

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "Manufacturer not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Manufacturer deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Manufacturer:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the Manufacturer",
      status: 500,
    });
  }
};