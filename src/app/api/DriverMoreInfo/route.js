import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  // console.log(data);

  const {
    driverId,
    vehicle,
    paymentcycle,
    startDate,
    payment,
    endDate,
    driverName,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data; // Extract the new variables

  console.log(data);

  // Check for existing DriverMoreInfo by email
  const existingDriverMoreInfo = await DriverMoreInfo.findOne({
    startDate: startDate,
  });
  if (existingDriverMoreInfo) {
    return NextResponse.json({
      error: "DriverMoreInfo with this startDate already exists",
      status: 400,
    });
  }

  // Create and save the new DriverMoreInfo entry
  const newDriverMoreInfo = new DriverMoreInfo({
    driverId,
    vehicle,
    paymentcycle,
    startDate,
    payment,
    endDate,
    driverName,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  });

  const savedDriverMoreInfo = await newDriverMoreInfo.save();
  if (!savedDriverMoreInfo) {
    return NextResponse.json({
      message: "DriverMoreInfo not added",
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
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allDriverMoreInfo = await DriverMoreInfo.find();
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
