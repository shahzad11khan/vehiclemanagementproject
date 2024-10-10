import { connect } from "@config/db.js";
import FuelType from "@models/FuelType/FuelType.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingFuelType = await FuelType.findOne({ name });
  if (existingFuelType) {
    return NextResponse.json({
      error: "FuelType with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newFuelType = new FuelType({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newFuelType);

  const savedFuelType = await newFuelType.save();
  if (!savedFuelType) {
    return NextResponse.json({
      message: "FuelType not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "FuelType  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allFuelType = await FuelType.find();
  const FuelTypeCount = await FuelType.countDocuments();
  if (!allFuelType || allFuelType.length === 0) {
    return NextResponse.json({ Result: allFuelType });
  } else {
    return NextResponse.json({
      Result: allFuelType,
      count: FuelTypeCount,
    });
  }
});
