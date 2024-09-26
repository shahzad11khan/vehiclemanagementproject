import { connect } from "@config/db.js";
import Manufecturer from "@models/Manufecturer/Manufecturer.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.formData();

  // Constructing formDataObject excluding the files
  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  const { name, description, isActive } = formDataObject; // Extract the new variables

  // Check for existing vehicle by name
  const existingVehicle = await Manufecturer.findOne({ name });
  if (existingVehicle) {
    return NextResponse.json({
      error: "Manufecturer with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newManufecturer = new Manufecturer({
    name,
    description,
    isActive,
  });

  console.log(newManufecturer);

  const savedManufecturer = await newManufecturer.save();
  if (!savedManufecturer) {
    return NextResponse.json({
      message: "Manufecturer not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "Manufecturer  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allManufecturer = await Manufecturer.find();
  const ManufecturerCount = await Manufecturer.countDocuments();
  if (!allManufecturer || allManufecturer.length === 0) {
    return NextResponse.json({ Result: allManufecturer });
  } else {
    return NextResponse.json({
      result: allManufecturer,
      count: ManufecturerCount,
    });
  }
});
