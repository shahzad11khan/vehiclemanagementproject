import { connect } from "@config/db.js";
import VehicleMOT from "@models/VehicleMOT/VehicleMOT.Model.js";
import { NextResponse } from "next/server";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const {
    VehicleName,
    registrationNumber,
    motCurrentDate,
    motDueDate,
    motCycle,
    motStatus,
    asignto,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data; // Extract the new variables

  // Create and save the new vehicle entry
  const newVehicleMOT = new VehicleMOT({
    VehicleName,
    registrationNumber,
    motCurrentDate,
    motDueDate,
    motCycle,
    motStatus,
    asignto,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  });

  console.log(newVehicleMOT);

  const savedVehicleMOT = await newVehicleMOT.save();
  if (!savedVehicleMOT) {
    return NextResponse.json({
      error: "VehicleMOT not added",
      success: false,
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "VehicleMOT  created successfully",
      success: true,
      data: savedVehicleMOT,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allVehicleMOT = await VehicleMOT.find().sort({ createdAt: -1 });
  const VehicleMOTCount = await VehicleMOT.countDocuments();
  if (!allVehicleMOT || allVehicleMOT.length === 0) {
    return NextResponse.json({ Result: allVehicleMOT });
  } else {
    return NextResponse.json({
      Result: allVehicleMOT,
      count: VehicleMOTCount,
    });
  }
});
