import { connect } from "@config/db.js";
import Insurence from "@models/Insurence/Insurence.model.js";
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
  const existingVehicle = await Insurence.findOne({ name });
  if (existingVehicle) {
    return NextResponse.json({
      error: "Insurence with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newInsurence = new Insurence({
    name,
    description,
    isActive,
  });

  console.log(newInsurence);

  const savedInsurence = await newInsurence.save();
  if (!savedInsurence) {
    return NextResponse.json({
      message: "Insurence not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "Insurence  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allInsurence = await Insurence.find();
  const InsurenceCount = await Insurence.countDocuments();
  if (!allInsurence || allInsurence.length === 0) {
    return NextResponse.json({ Result: allInsurence });
  } else {
    return NextResponse.json({ result: allInsurence, count: InsurenceCount });
  }
});
