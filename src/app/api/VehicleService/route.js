import { connect } from "@config/db.js";
import VehicleService from "@models/VehicleService/VehicleService.Model.js";
import { NextResponse } from "next/server";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const {
    VehicleName,
    registrationNumber,
    serviceCurrentDate,
    serviceDueDate,
    serviceStatus,
    servicemailes,
    asignto,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data; // Extract the new variables

  // Create and save the new vehicle entry
  const newVehicleService = new VehicleService({
    VehicleName,
    registrationNumber,
    serviceCurrentDate,
    serviceDueDate,
    serviceStatus,
    servicemailes,
    asignto,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  });

  console.log(newVehicleService);

  const savedVehicleService = await newVehicleService.save();
  if (!savedVehicleService) {
    return NextResponse.json({
      error: "VehicleService not added",
      success: false,
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "VehicleService  created successfully",
      success: true,
      status: 200,
      data: savedVehicleService,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allVehicleService = await VehicleService.find();
  const VehicleServiceCount = await VehicleService.countDocuments();
  if (!allVehicleService || allVehicleService.length === 0) {
    return NextResponse.json({ Result: allVehicleService });
  } else {
    return NextResponse.json({
      Result: allVehicleService,
      count: VehicleServiceCount,
    });
  }
});
