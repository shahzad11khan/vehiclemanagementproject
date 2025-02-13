import { connect } from "@config/db.js";
import FuelType from "@models/FuelType/FuelType.Model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.FuelTypeID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive, adminCreatedBy, adminCompanyName,companyId } = data;

    // Find the manufacturer by ID
    const fueltype = await FuelType.findById({ _id: id });

    if (!fueltype) {
      return NextResponse.json({
        error: "FuelType not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    fueltype.name = name ? name.trim() : fueltype.name; // Update name or retain existing
    fueltype.adminCreatedBy = adminCreatedBy ? adminCreatedBy.trim() : fueltype.adminCreatedBy; // Update name or retain existing
    fueltype.adminCompanyName = adminCompanyName ? adminCreatedBy.trim() : fueltype.adminCompanyName; // Update name or retain existing
    fueltype.companyId = adminCompanyName ? companyId.trim() : fueltype.companyId; // Update name or retain existing
    fueltype.description = description
      ? description.trim()
      : fueltype.description; // Update description or retain existing
    fueltype.isActive = isActive !== undefined ? isActive : fueltype.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await fueltype.save();

    return NextResponse.json({
      message: "FuelType details updated successfully",
      fueltype, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating FuelType:", error);
    return NextResponse.json({
      error: "Failed to update FuelType",
      status: 500,
    });
  }
};

// GET handler for retrieving a specific manufacturer by ID
export const GET = async (request, context) => {
  try {
    // Connect to the database
    await connect();

    // Extract the Manufacturer ID from the request parameters
    const id = context.params.FuelTypeID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_FuelType = await FuelType.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_FuelType) {
      return NextResponse.json({
        result: "No FuelType Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_FuelType, status: 200 });
  } catch (error) {
    console.error("Error fetching FuelType:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch FuelType",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { FuelTypeID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", FuelTypeID);

    // Find and delete the manufacturer
    const deletedManufacturer = await FuelType.findByIdAndDelete(FuelTypeID);

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "FuelType not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "FuelType deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting FuelType:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the FuelType",
      status: 500,
    });
  }
};
