import { connect } from "@config/db.js";
import Supplier from "@models/Supplier/Supplier.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a Supplier by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.SupplierID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive } = formDataObject;

  // Find the vehicle by ID
  const supplier = await Supplier.findById(id);

  if (!supplier) {
    return NextResponse.json({
      error: "Supplier not found",
      status: 404,
    });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  supplier.name = name ? name.trim() : supplier.name; // Update name or retain existing
  supplier.description = description
    ? description.trim()
    : supplier.description; // Update description or retain existing
  supplier.isActive = isActive ? isActive : supplier.isActive;

  // Save the updated vehicle
  await supplier.save();

  return NextResponse.json({
    message: "Supplier details updated successfully",
    Supplier,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const { SupplierID } = params;
  console.log(SupplierID);

  // Find the driver by ID
  const Find_Supplier = await Supplier.findById(SupplierID);

  // Check if the driver exists
  if (!Find_Supplier) {
    return NextResponse.json({
      result: "No Supplier Found",
      status: 404,
    });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Supplier, status: 200 });
});

// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { SupplierID } = params; // Access the ManufacturerID from params

    console.log("Supplier ID:", SupplierID);

    // Find and delete the manufacturer
    const deletedSupplier = await Supplier.findByIdAndDelete(SupplierID);

    if (!deletedSupplier) {
      return NextResponse.json({
        error: "Supplier not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Supplier deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Supplier:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the Supplier",
      status: 500,
    });
  }
};
