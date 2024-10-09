import { connect } from "@config/db.js";
import Employee from "@models/Employee/Empoyee.Model";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.EmployeeID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const { name, description, isActive } = data;

    // Find the manufacturer by ID
    const employe = await Employee.findById({ _id: id });

    if (!employe) {
      return NextResponse.json({
        error: "employe not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    employe.name = name ? name.trim() : employe.name; // Update name or retain existing
    employe.description = description
      ? description.trim()
      : employe.description; // Update description or retain existing
    employe.isActive = isActive !== undefined ? isActive : employe.isActive; // Ensure isActive is treated correctly

    // Save the updated manufacturer
    await employe.save();

    return NextResponse.json({
      message: "Employee details updated successfully",
      employe, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Employee:", error);
    return NextResponse.json({
      error: "Failed to update Employee",
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
    const id = context.params.EmployeeID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_Employee = await Employee.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_Employee) {
      return NextResponse.json({
        result: "No Employee Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_Employee, status: 200 });
  } catch (error) {
    console.error("Error fetching Employee:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch Employee",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { EmployeeID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", EmployeeID);

    // Find and delete the manufacturer
    const deletedManufacturer = await Employee.findByIdAndDelete(EmployeeID);

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "Employee not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Employee deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting Employee:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the Employee",
      status: 500,
    });
  }
};
