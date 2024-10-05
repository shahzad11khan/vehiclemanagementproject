import { connect } from "@config/db.js";
import Manufecturer from "@models/Manufecturer/Manufecturer.Model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.ManufacturerID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive } = data;

    // Find the manufacturer by ID
    const manufacturer = await Manufecturer.findById({ _id: id });

    if (!manufacturer) {
      return NextResponse.json({
        error: "Manufacturer not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    manufacturer.name = name ? name.trim() : manufacturer.name; // Update name or retain existing
    manufacturer.description = description
      ? description.trim()
      : manufacturer.description; // Update description or retain existing
    manufacturer.isActive =
      isActive !== undefined ? isActive : manufacturer.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await manufacturer.save();

    return NextResponse.json({
      message: "Manufacturer details updated successfully",
      manufacturer, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating manufacturer:", error);
    return NextResponse.json({
      error: "Failed to update manufacturer",
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
    const id = context.params.ManufacturerID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_Manufecturer = await Manufecturer.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_Manufecturer) {
      return NextResponse.json({
        result: "No Manufacturer Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_Manufecturer, status: 200 });
  } catch (error) {
    console.error("Error fetching manufacturer:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch manufacturer",
      status: 500,
    });
  }
};
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
