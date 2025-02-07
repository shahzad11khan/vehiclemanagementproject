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
    driverName,
    vehicle,
    vehicleId,
    startDate,
    paymentcycle,
    payment,
    endDate,
    totalamount,
    totalToremain,
    remaining,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data; // Extract the new variables

  console.log(data);
  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ignore time
    return normalizedDate;
  };
  
  // Check for existing DriverMoreInfo by driverId, vehicleId, and adminCompanyName
  const findStartDate = await DriverMoreInfo.findOne({
    driverId: driverId,
    vehicleId: vehicleId,
    adminCompanyName: adminCompanyName // You can also add other conditions like vehicleId or driverId
  });
  if (findStartDate) {
    const normalizedStartDate = normalizeDate(startDate); // Normalize the incoming date
    const storedStartDate = normalizeDate(findStartDate?.startDate); // Normalize the stored date
  
    // If the dates (ignoring time) are the same, do not add the new record
    if (normalizedStartDate.getTime() === storedStartDate.getTime()) {
      return NextResponse.json({
        error: "DriverMoreInfo with this startDate already exists (ignoring time)",
        status: 400,
      });
    }
  }

  // Create and save the new DriverMoreInfo entry
  const newDriverMoreInfo = new DriverMoreInfo({
    driverId,
    driverName,
    vehicle,
    vehicleId,
    startDate,
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
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allDriverMoreInfo = await DriverMoreInfo.find().sort({ createdAt: -1 });
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
