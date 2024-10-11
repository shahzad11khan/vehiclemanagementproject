import { connect } from "@config/db.js";
import BodyType from "@models/BodyType/BodyType.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingBodyType = await BodyType.findOne({
    name: name,
    adminCompanyName: adminCompanyName,
  });
  if (existingBodyType) {
    return NextResponse.json({
      error: "BodyType with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newBodyType = new BodyType({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newBodyType);

  const savedBodyType = await newBodyType.save();
  if (!savedBodyType) {
    return NextResponse.json({
      message: "BodyType not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "BodyType  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allBodyType = await BodyType.find();
  const BodyTypeCount = await BodyType.countDocuments();
  if (!allBodyType || allBodyType.length === 0) {
    return NextResponse.json({ Result: allBodyType });
  } else {
    return NextResponse.json({
      Result: allBodyType,
      count: BodyTypeCount,
    });
  }
});
