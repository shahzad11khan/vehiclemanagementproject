import { connect } from "@config/db.js";
import Transmission from "@models/Transmission/Transmission.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingTransmission = await Transmission.findOne({
  $and: [{ name: name }, { adminCompanyName: adminCompanyName }],
});
  if (existingTransmission) {
    return NextResponse.json({
      error: "Transmission with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newTransmission = new Transmission({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newTransmission);

  const savedTransmission = await newTransmission.save();
  if (!savedTransmission) {
    return NextResponse.json({
      message: "Transmission not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "Transmission  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allTransmission = await Transmission.find().sort({ createdAt: -1 });
  const TransmissionCount = await Transmission.countDocuments();
  if (!allTransmission || allTransmission.length === 0) {
    return NextResponse.json({ Result: allTransmission });
  } else {
    return NextResponse.json({
      Result: allTransmission,
      count: TransmissionCount,
    });
  }
});
