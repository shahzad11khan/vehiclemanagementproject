import { connect } from "@config/db.js";
import Insurence from "@models/Insurence/Insurence.model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.InsurenceID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive,companyId } = data;

    // Find the manufacturer by ID
    const insurence = await Insurence.findById({ _id: id });

    if (!insurence) {
      return NextResponse.json({
        error: "insurence not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    insurence.name = name ? name.trim() : insurence.name; // Update name or retain existing
    insurence.companyId = companyId ? companyId : insurence.companyId; // Update name or retain existing
    insurence.description = description
      ? description.trim()
      : insurence.description; // Update description or retain existing
    insurence.isActive = isActive !== undefined ? isActive : insurence.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await insurence.save();

    return NextResponse.json({
      message: "Insurence details updated successfully",
      insurence, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Insurence:", error);
    return NextResponse.json({
      error: "Failed to update Insurence",
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
    const id = context.params.InsurenceID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_Insurence = await Insurence.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_Insurence) {
      return NextResponse.json({
        result: "No Insurence Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_Insurence, status: 200 });
  } catch (error) {
    console.error("Error fetching Insurence:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch Insurence",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { InsurenceID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", InsurenceID);

    // Find and delete the manufacturer
    const deletedManufacturer = await Insurence.findByIdAndDelete(InsurenceID);

    if (!deletedManufacturer) {
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
