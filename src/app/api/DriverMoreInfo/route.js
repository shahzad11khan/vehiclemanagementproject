import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";



export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const {
    driverId,
    driverName,
    vehicle,
    vehicleId,
    registrationNumber,
    startDate,
    paymentcycle,
    payment,
    endDate,
    totalToremain,
    remaining,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data;

  // Format the startDate to MM-DD-YYYY
  try {
    // Check if a record exists with the same date
    const existingRecord = await DriverMoreInfo.findOne({
      driverId,
      vehicleId,
      adminCompanyName,
      startDate,
      registrationNumber
    });

    if (existingRecord) {
      return NextResponse.json({
        error: "A record for this date already exists.",
        status: 400,
      });
    }

    // Create and save the new record
    const newDriverMoreInfo = new DriverMoreInfo({
      driverId,
      driverName,
      vehicle,
      vehicleId,
      startDate, // Save the normalized date
      registrationNumber,
      paymentcycle,
      payment,
      totalamount:payment,
      endDate,
      totalToremain,
      remaining,
      adminCreatedBy,
      adminCompanyName,
      adminCompanyId,
    });

    const savedDriverMoreInfo = await newDriverMoreInfo.save();

    if (!savedDriverMoreInfo) {
      return NextResponse.json({
        error: "DriverMoreInfo not added",
        status: 400,
      });
    }

    return NextResponse.json({
      message: "DriverMoreInfo created successfully",
      success: true,
      savedDriverMoreInfo,
      status: 200,
    });
  } catch (error) {
    console.error("Error saving DriverMoreInfo:", error);
    return NextResponse.json({
      error: "An error occurred while saving DriverMoreInfo.",
      status: 500,
    });
  }
});




export const GET = catchAsyncErrors(async () => {
  await connect();
  const allDriverMoreInfo = await DriverMoreInfo.find().sort({startDate: -1});
  const DriverMoreInfoCount = await DriverMoreInfo.countDocuments();
  if (!allDriverMoreInfo || allDriverMoreInfo.length === 0) {
    return NextResponse.json({ Result: allDriverMoreInfo });
  } else {
    return NextResponse.json({
      Result: allDriverMoreInfo,
      count: DriverMoreInfoCount,
    });
  }
});
