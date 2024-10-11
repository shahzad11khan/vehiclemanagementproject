import { connect } from "@config/db.js";
import Employee from "@models/Employee/Empoyee.Model";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingVehicle = await Employee.findOne({
    name: name,
    adminCompanyName: adminCompanyName,
  });
  if (existingVehicle) {
    return NextResponse.json({
      error: "Employee with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newInsurence = new Employee({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newInsurence);

  const savedInsurence = await newInsurence.save();
  if (!savedInsurence) {
    return NextResponse.json({
      message: "Employee not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "Employee  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allEmployee = await Employee.find();
  const EmployeeCount = await Employee.countDocuments();
  if (!allEmployee || allEmployee.length === 0) {
    return NextResponse.json({ Result: allEmployee });
  } else {
    return NextResponse.json({ Result: allEmployee, count: EmployeeCount });
  }
});
