import { connect } from "@config/db.js";
import Employee from "@models/Employee/Empoyee.Model";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a Employee by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.EmployeeID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive } = formDataObject;

  // Find the vehicle by ID
  const Employee = await Employee.findById(id);

  if (!Employee) {
    return NextResponse.json({
      error: "Employee not found",
      status: 404,
    });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  Employee.name = name ? name.trim() : Employee.name; // Update name or retain existing
  Employee.description = description
    ? description.trim()
    : Employee.description; // Update description or retain existing
  Employee.isActive = isActive ? isActive : Employee.isActive;

  // Save the updated vehicle
  await Employee.save();

  return NextResponse.json({
    message: "Employee details updated successfully",
    Employee,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.EmployeeID;
  console.log(id);

  // Find the driver by ID
  const Find_Employee = await Employee.findById(id);

  // Check if the driver exists
  if (!Find_Employee) {
    return NextResponse.json({
      result: "No Employee Found",
      status: 404,
    });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Employee, status: 200 });
});

// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { EmployeeID } = params; // Access the ManufacturerID from params

    console.log("Employee ID:", EmployeeID);

    // Find and delete the manufacturer
    const deletedEmployee = await Employee.findByIdAndDelete(EmployeeID);

    if (!deletedEmployee) {
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
