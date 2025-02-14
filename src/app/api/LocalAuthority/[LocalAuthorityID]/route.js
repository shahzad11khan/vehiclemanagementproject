import { connect } from "@config/db.js";
import LocalAuthority from "@models/LocalAuthority/LocalAuthority.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.LocalAuthorityID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive,companyId } = data;

    // Find the manufacturer by ID
    const authority = await LocalAuthority.findById({ _id: id });

    if (!authority) {
      return NextResponse.json({
        error: "LocalAuthority not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    authority.name = name ? name.trim() : authority.name; // Update name or retain existing
    authority.companyId = companyId ? companyId : authority.companyId; // Update name or retain existing
    authority.description = description
      ? description.trim()
      : authority.description; // Update description or retain existing
    authority.isActive = isActive !== undefined ? isActive : authority.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await authority.save();

    return NextResponse.json({
      message: "LocalAuthority details updated successfully",
      authority, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating LocalAuthority:", error);
    return NextResponse.json({
      error: "Failed to update LocalAuthority",
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
    const id = context.params.LocalAuthorityID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_LocalAuthority = await LocalAuthority.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_LocalAuthority) {
      return NextResponse.json({
        result: "No LocalAuthority Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_LocalAuthority, status: 200 });
  } catch (error) {
    console.error("Error fetching LocalAuthority:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch LocalAuthority",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { LocalAuthorityID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", LocalAuthorityID);

    // Find and delete the manufacturer
    const deletedManufacturer = await LocalAuthority.findByIdAndDelete(
      LocalAuthorityID
    );

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "LocalAuthority not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "LocalAuthority deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting LocalAuthority:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the LocalAuthority",
      status: 500,
    });
  }
};
