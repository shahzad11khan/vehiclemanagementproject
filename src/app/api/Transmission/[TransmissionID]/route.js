import { connect } from "@config/db.js";
import Transmission from "@models/Transmission/Transmission.Model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.TransmissionID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive } = data;

    // Find the manufacturer by ID
    const transmission = await Transmission.findById({ _id: id });

    if (!transmission) {
      return NextResponse.json({
        error: "transmission not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    transmission.name = name ? name.trim() : transmission.name; // Update name or retain existing
    transmission.description = description
      ? description.trim()
      : transmission.description; // Update description or retain existing
    transmission.isActive =
      isActive !== undefined ? isActive : transmission.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await transmission.save();

    return NextResponse.json({
      message: "Transmission details updated successfully",
      transmission, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Transmission:", error);
    return NextResponse.json({
      error: "Failed to update Transmission",
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
    const id = context.params.TransmissionID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_Transmission = await Transmission.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_Transmission) {
      return NextResponse.json({
        result: "No Transmission Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_Transmission, status: 200 });
  } catch (error) {
    console.error("Error fetching Transmission:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch Transmission",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { TransmissionID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", TransmissionID);

    // Find and delete the manufacturer
    const deletedManufacturer = await Transmission.findByIdAndDelete(
      TransmissionID
    );

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "Transmission not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Transmission deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Transmission:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the Transmission",
      status: 500,
    });
  }
};
