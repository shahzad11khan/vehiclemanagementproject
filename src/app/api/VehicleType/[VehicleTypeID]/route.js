import { connect } from "@config/db.js";
import VehicleType from "@models/VehicleType/VehicleType.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.VehicleTypeID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive } = data;

    // Find the manufacturer by ID
    const vehicleType = await VehicleType.findById({ _id: id });

    if (!VehicleType) {
      return NextResponse.json({
        error: "VehicleType not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    vehicleType.name = name ? name.trim() : vehicleType.name; // Update name or retain existing
    vehicleType.description = description
      ? description.trim()
      : vehicleType.description; // Update description or retain existing
    vehicleType.isActive =
      isActive !== undefined ? isActive : vehicleType.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await vehicleType.save();

    return NextResponse.json({
      message: "VehicleType details updated successfully",
      vehicleType, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating VehicleType:", error);
    return NextResponse.json({
      error: "Failed to update VehicleType",
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
    const id = context.params.VehicleTypeID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_VehicleType = await VehicleType.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_VehicleType) {
      return NextResponse.json({
        result: "No VehicleType Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_VehicleType, status: 200 });
  } catch (error) {
    console.error("Error fetching VehicleType:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch VehicleType",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { VehicleTypeID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", VehicleTypeID);

    // Find and delete the manufacturer
    const deletedManufacturer = await VehicleType.findByIdAndDelete(
      VehicleTypeID
    );

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "VehicleType not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "VehicleType deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting VehicleType:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the VehicleType",
      status: 500,
    });
  }
};
