import { connect } from "@config/db.js";
import Badge from "@models/Badge/Badge.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.BadgeID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive } = data;

    // Find the manufacturer by ID
    const badge = await Badge.findById({ _id: id });

    if (!badge) {
      return NextResponse.json({
        error: "badge not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    badge.name = name ? name.trim() : badge.name; // Update name or retain existing
    badge.description = description ? description.trim() : badge.description; // Update description or retain existing
    badge.isActive = isActive !== undefined ? isActive : badge.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await badge.save();

    return NextResponse.json({
      message: "Badge details updated successfully",
      badge, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Badge:", error);
    return NextResponse.json({
      error: "Failed to update Badge",
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
    const id = context.params.BadgeID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_Badge = await Badge.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_Badge) {
      return NextResponse.json({
        result: "No Badge Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_Badge, status: 200 });
  } catch (error) {
    console.error("Error fetching Badge:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch Badge",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { BadgeID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", BadgeID);

    // Find and delete the manufacturer
    const deletedManufacturer = await Badge.findByIdAndDelete(BadgeID);

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "Badge not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Badge deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Badge:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the Badge",
      status: 500,
    });
  }
};
