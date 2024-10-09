import { connect } from "@config/db.js";
import Supplier from "@models/Supplier/Supplier.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.SupplierID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive } = data;

    // Find the manufacturer by ID
    const supplier = await Supplier.findById({ _id: id });

    if (!supplier) {
      return NextResponse.json({
        error: "Supplier not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    supplier.name = name ? name.trim() : supplier.name; // Update name or retain existing
    supplier.description = description
      ? description.trim()
      : supplier.description; // Update description or retain existing
    supplier.isActive = isActive !== undefined ? isActive : supplier.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await supplier.save();

    return NextResponse.json({
      message: "Supplier details updated successfully",
      supplier, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Supplier:", error);
    return NextResponse.json({
      error: "Failed to update Supplier",
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
    const id = context.params.SupplierID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_Supplier = await Supplier.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_Supplier) {
      return NextResponse.json({
        result: "No Supplier Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_Supplier, status: 200 });
  } catch (error) {
    console.error("Error fetching Supplier:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch Supplier",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { SupplierID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", SupplierID);

    // Find and delete the manufacturer
    const deletedManufacturer = await Supplier.findByIdAndDelete(SupplierID);

    if (!deletedManufacturer) {
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
