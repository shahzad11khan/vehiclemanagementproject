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

  // Normalize the startDate to remove the time component
  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00
    return normalizedDate.toISOString(); // Convert to ISO string format
  };

  const normalizedStartDate = normalizeDate(startDate);

  try {
    // Check if a record exists with the same date
    const existingRecord = await DriverMoreInfo.findOne({
      driverId,
      vehicleId,
      adminCompanyName,
      startDate: normalizedStartDate,
    });

    if (existingRecord) {
      return NextResponse.json({
        error: "A record for this date already exists.",
        status: 400,
      });
    }

    // Check for any previous record with the same driver and vehicle (across different dates)
    const previousRecord = await DriverMoreInfo.findOne({
      driverId,
      vehicleId,
      adminCompanyName,
    });

    // Initialize totalamount with payment
    let totalamount = payment;

    // If a previous record exists, add its totalamount
    if (previousRecord) {
      totalamount += previousRecord.totalamount;
    }

    // Create and save the new record
    const newDriverMoreInfo = new DriverMoreInfo({
      driverId,
      driverName,
      vehicle,
      vehicleId,
      startDate: normalizedStartDate, // Save the normalized date
      paymentcycle,
      payment,
      endDate,
      totalamount,
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
    } else {
      return NextResponse.json({
        message: "DriverMoreInfo created successfully",
        success: true,
        savedDriverMoreInfo,
        status: 200,
      });
    }
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
