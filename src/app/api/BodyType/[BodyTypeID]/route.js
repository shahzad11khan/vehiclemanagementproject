import { connect } from "@config/db.js";
import BodyType from "@models/BodyType/BodyType.Model.js";

import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.BodyTypeID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data


    // Destructure the necessary fields
    const { name, description, isActive, adminCreatedBy, adminCompanyName,companyId } = data;

    // Find the manufacturer by ID
    const bodytype = await BodyType.findById({ _id: id });

    if (!BodyType) {
      return NextResponse.json({
        error: "BodyType not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    bodytype.name = name ? name.trim() : bodytype.name; // Update name or retain existing
    bodytype.adminCompanyName = adminCompanyName ? adminCompanyName.trim() : bodytype.adminCompanyName; // Update name or retain existing
    bodytype.adminCreatedBy = namadminCreatedBye ? adminCreatedBy.trim() : bodytype.adminCreatedBy; // Update name or retain existing
    bodytype.companyId = companyId ? companyId : bodytype.companyId; // Update name or retain existing
    bodytype.description = description
      ? description.trim()
      : bodytype.description; // Update description or retain existing
    bodytype.isActive = isActive !== undefined ? isActive : bodytype.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await bodytype.save();

    return NextResponse.json({
      message: "BodyType details updated successfully",
      bodytype, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating BodyType:", error);
    return NextResponse.json({
      error: "Failed to update BodyType",
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
    const id = context.params.BodyTypeID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_BodyType = await BodyType.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_BodyType) {
      return NextResponse.json({
        result: "No BodyType Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_BodyType, status: 200 });
  } catch (error) {
    console.error("Error fetching BodyType:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch BodyType",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { BodyTypeID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", BodyTypeID);

    // Find and delete the manufacturer
    const deletedManufacturer = await BodyType.findByIdAndDelete(BodyTypeID);

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "BodyType not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "BodyType deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting BodyType:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the BodyType",
      status: 500,
    });
  }
};
