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
    cost,
    pay,
    discription,
    adminCompanyName,
    adminCompanyId
  } = data;
console.log(data)
  // Format the startDate to MM-DD-YYYY
  try {
    // Check if a record exists with the same date
    const date = new Date(startDate)
    // Create and save the new record
    const newDriverMoreInfo = new DriverMoreInfo({
        driverId,
        driverName,
        vehicle,
        vehicleId,
        startDate:date,
        payment:cost,
        pay,
        discription,
        adminCompanyName,
        adminCompanyId
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

