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

  // Format the startDate to MM-DD-YYYY
  const formatDateToMMDDYYYY = (dateString) => {
    const date = new Date(dateString); // Ensure it's a Date object
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const normalizedStartDate = formatDateToMMDDYYYY(startDate);
  console.log("normalizedStartDate", normalizedStartDate);

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

    // Check for any previous record with the same driver and vehicle
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
