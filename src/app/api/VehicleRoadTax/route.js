import { connect } from "@config/db.js";
import VehicleRoadTax from "@models/VehicleRoadTax/VehicleRoadTax.Model.js";
import { NextResponse } from "next/server";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const {
    VehicleName,
    registrationNumber,
    roadtexCurrentDate,
    roadtexDueDate,
    roadtexStatus,
    roadtexCycle,
    asignto,
    roadtexPending_Done,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data; // Extract the new variables

  // Create and save the new vehicle entry
  const newVehicleRoadTax = new VehicleRoadTax({
    VehicleName,
    registrationNumber,
    roadtexCurrentDate,
    roadtexDueDate,
    roadtexStatus,
    roadtexCycle,
    asignto,
    roadtexPending_Done,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  });

  console.log(newVehicleRoadTax);

  const savedVehicleRoadTax = await newVehicleRoadTax.save();
  if (!savedVehicleRoadTax) {
    return NextResponse.json({
      error: "VehicleRoadTax not added",
      success: false,
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "VehicleRoadTax  created successfully",
      success: true,
      status: 200,
      data: savedVehicleRoadTax,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allVehicleRoadTax = await VehicleRoadTax.find().sort({ createdAt: -1 });
  const VehicleRoadTaxCount = await VehicleRoadTax.countDocuments();
  if (!allVehicleRoadTax || allVehicleRoadTax.length === 0) {
    return NextResponse.json({ Result: allVehicleRoadTax });
  } else {
    return NextResponse.json({
      Result: allVehicleRoadTax,
      count: VehicleRoadTaxCount,
    });
  }
});
