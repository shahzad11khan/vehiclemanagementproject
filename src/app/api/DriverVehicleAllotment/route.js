import { connect } from "@config/db.js";
import DriverVehicleAllotment from "@models/DriverVehicleAllotment/DriverVehicleAllotment.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  console.log(data);

  const {
    driverId,
    startDate,
    driverName,
    taxifirm,
    taxilocalauthority,
    vehicle,
    paymentcycle,
    payment,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data; // Extract the new variables

  console.log(data);

  // Check for existing DriverVehicleAllotment by email
  const existingDriverVehicleAllotment = await DriverVehicleAllotment.findOne({
    startDate: startDate,
  });
  if (existingDriverVehicleAllotment) {
    return NextResponse.json({
      error: "DriverVehicleAllotment with this startDate already exists",
      status: 400,
    });
  }

  // Create and save the new DriverVehicleAllotment entry
  const newDriverVehicleAllotment = new DriverVehicleAllotment({
    driverId,
    startDate,
    driverName,
    taxifirm,
    taxilocalauthority,
    vehicle,
    paymentcycle,
    payment,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  });

  const savedDriverVehicleAllotment = await newDriverVehicleAllotment.save();
  if (!savedDriverVehicleAllotment) {
    return NextResponse.json({
      message: "DriverVehicleAllotment not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "DriverVehicleAllotment created successfully",
      success: true,
      savedDriverVehicleAllotment,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allDriverVehicleAllotment = await DriverVehicleAllotment.find();
  const DriverVehicleAllotmentCount =
    await DriverVehicleAllotment.countDocuments();
  if (!allDriverVehicleAllotment || allDriverVehicleAllotment.length === 0) {
    return NextResponse.json({ Result: allDriverVehicleAllotment });
  } else {
    return NextResponse.json({
      Result: allDriverVehicleAllotment,
      count: DriverVehicleAllotmentCount,
    });
  }
});
