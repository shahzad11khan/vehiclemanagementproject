import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// export const POST = catchAsyncErrors(async (request) => {

//   await connect();
//   const data = await request.json();

//   // console.log(data);

//   const {
//     driverId,
//     driverName,
//     vehicle,
//     vehicleId,
//     startDate,
//     paymentcycle,
//     payment,
//     endDate,
//     totalamount,
//     totalToremain,
//     remaining,
//     adminCreatedBy,
//     adminCompanyName,
//     adminCompanyId,
//   } = data; // Extract the new variables

//   console.log(data);
//   const normalizeDate = (date) => {
//     const normalizedDate = new Date(date);
//     normalizedDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ignore time
//     return normalizedDate;
//   };
  
//   const findStartDate = await DriverMoreInfo.findOne({
//     driverId: driverId,
//     vehicleId: vehicleId,
//     adminCompanyName: adminCompanyName,
//   });
  
//   if (findStartDate) {
//     const isSameDayMonthYear = (date1, date2) => {
//       const d1 = new Date(date1);
//       const d2 = new Date(date2);
  
//       return (
//         d1.getDate() === d2.getDate() &&
//         d1.getMonth() === d2.getMonth() &&
//         d1.getFullYear() === d2.getFullYear()
//       );
//     };
  
//     const currentDate = new Date(); // Get the current date
  
//     // Check if the stored date is the same as the current date
//     if (isSameDayMonthYear(findStartDate.startDate, currentDate)) {
//       return NextResponse.json({
//         error: "DriverMoreInfo with today's date already exists",
//         status: 400,
//       });
//     }
//   }
  
//   // Create and save the new DriverMoreInfo entry
//   const newDriverMoreInfo = new DriverMoreInfo({
//     driverId,
//     driverName,
//     vehicle,
//     vehicleId,
//     startDate,
//     paymentcycle,
//     payment,
//     endDate,
//     totalamount,
//     totalToremain,
//     remaining,
//     adminCreatedBy,
//     adminCompanyName,
//     adminCompanyId,
//   });

//   const savedDriverMoreInfo = await newDriverMoreInfo.save();
//   if (!savedDriverMoreInfo) {
//     return NextResponse.json({
//       error: "DriverMoreInfo not added",
//       status: 400,
//     });
//   } else {
//     return NextResponse.json({
//       message: "DriverMoreInfo created successfully",
//       success: true,
//       savedDriverMoreInfo,
//       status: 200,
//     });
//   }
// });

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
    totalamount,
    totalToremain,
    remaining,
    adminCreatedBy,
    adminCompanyName,
    adminCompanyId,
  } = data;

  // Normalize the incoming startDate to remove the time portion
  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Set to 00:00:00
    return normalizedDate;
  };

  const normalizedStartDate = normalizeDate(startDate); // Normalize the incoming start date

  // Check if a record with the same driverId, vehicleId, and adminCompanyName exists
  const findStartDate = await DriverMoreInfo.findOne({
    driverId: driverId,
    vehicleId: vehicleId,
    adminCompanyName: adminCompanyName,
  });

  if (findStartDate) {
    // Normalize the stored startDate from the database
    const storedStartDate = normalizeDate(findStartDate.startDate);

    // Check if the dates are the same (same day, month, and year)
    if (normalizedStartDate.getTime() === storedStartDate.getTime()) {
      return NextResponse.json({
        error: "DriverMoreInfo with the same start date already exists",
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
    startDate: normalizedStartDate, // Ensure the date is normalized before saving
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
