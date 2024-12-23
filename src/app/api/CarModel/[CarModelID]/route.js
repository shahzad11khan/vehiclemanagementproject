import { connect } from "@config/db.js";
import CarModel from "@models/CarModel/Car.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.CarModelID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name,makemodel, description, isActive } = data;

    // Find the manufacturer by ID
    const carmodel = await CarModel.findById({ _id: id });

    if (!carmodel) {
      return NextResponse.json({
        error: "CarModel not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    carmodel.name = name ? name.trim() : carmodel.name; // Update name or retain existing
    carmodel.makemodel = makemodel ? makemodel.trim() : carmodel.makemodel; // Update name or retain existing
    carmodel.description = description
      ? description.trim()
      : carmodel.description; // Update description or retain existing
    carmodel.isActive = isActive !== undefined ? isActive : carmodel.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await carmodel.save();

    return NextResponse.json({
      message: "CarModel details updated successfully",
      carmodel, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating CarModel:", error);
    return NextResponse.json({
      error: "Failed to update CarModel",
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
    const id = context.params.CarModelID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_CarModel = await CarModel.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_CarModel) {
      return NextResponse.json({
        result: "No CarModel Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_CarModel, status: 200 });
  } catch (error) {
    console.error("Error fetching CarModel:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch CarModel",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { CarModelID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", CarModelID);

    // Find and delete the manufacturer
    const deletedManufacturer = await CarModel.findByIdAndDelete(CarModelID);

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "CarModel not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "CarModel deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting CarModel:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the CarModel",
      status: 500,
    });
  }
};
