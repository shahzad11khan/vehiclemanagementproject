import { connect } from "@config/db.js";
import VehicleType from "@models/VehicleType/VehicleType.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive } = data; // Extract the new variables

  // Check for existing vehicle by name
  const existingVehicle = await VehicleType.findOne({ name });
  if (existingVehicle) {
    return NextResponse.json({
      error: "VehicleType with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newVehicle = new VehicleType({
    name,
    description,
    isActive,
  });

  console.log(newVehicle);

  const savedVehicle = await newVehicle.save();
  if (!savedVehicle) {
    return NextResponse.json({ message: "VehicleType not added", status: 400 });
  } else {
    return NextResponse.json({
      message: "VehicleType created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allVehicleType = await VehicleType.find();
  const VehicleTypeCount = await VehicleType.countDocuments();
  if (!allVehicleType || allVehicleType.length === 0) {
    return NextResponse.json({ Result: allVehicleType });
  } else {
    return NextResponse.json({
      Result: allVehicleType,
      count: VehicleTypeCount,
    });
  }
});
