// import { connect } from "@config/db.js";
// import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
// import { NextResponse } from "next/server";



// export const POST = catchAsyncErrors(async (request) => {
//   await connect();
//   const data = await request.json();

//   const {
//     driverId,
//     driverName,
//     vehicle,
//     vehicleId,
//     startDate,
//     cost,
//     pay,
//     description, 
//     adminCompanyName,
//     adminCompanyId
//   } = data;
// console.log(data)
//   // Format the startDate to MM-DD-YYYY
//   try {
//     const latestRecord = await DriverMoreInfo.findOne({
//       driverId:driverId,
//       vehicleId: vehicleId,
//       adminCompanyName:adminCompanyName,
//     }).sort({ startDate: -1 });
 
//     console.log(latestRecord)
//     let total = 0;

//     if(cost === 0){
//     total =  latestRecord.totalamount += cost ;
//     }  
//     if(pay === 0){
//      total = latestRecord.totalamount -= pay ;
//     }

//     const date = new Date(startDate)

//     // Create and save the new record
//     const newDriverMoreInfo = new DriverMoreInfo({
//         driverId,
//         driverName,
//         vehicle,
//         vehicleId,
//         startDate:date,
//         payment:cost,
//         cost,
//         pay,
//         totalamount:total,
//         description, 
//         adminCompanyName,
//         adminCompanyId
//     });

//     const savedDriverMoreInfo = await newDriverMoreInfo.save();

//     if (!savedDriverMoreInfo) {
//       return NextResponse.json({
//         error: "DriverMoreInfo not added",
//         status: 400,
//       });
//     }

//     return NextResponse.json({
//       message: "DriverMoreInfo created successfully",
//       success: true,
//       savedDriverMoreInfo,
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error saving DriverMoreInfo:", error);
//     return NextResponse.json({
//       error: "An error occurred while saving DriverMoreInfo.",
//       status: 500,
//     });
//   }
// });


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
    registrationNumber,
    description,
    adminCompanyName,
    adminCompanyId,
  } = data;

  // console.log("Received Data:", data);

  try {
    // Find the latest record for the driver and vehicle
    const date = new Date(startDate);
    const latestRecord = await DriverMoreInfo.findOne({
      driverId,
      vehicleId,
      adminCompanyName,
      startDate:date,
      registrationNumber,
    }).sort({ createdAt: -1 });



    console.log("Latest Record:", latestRecord);

    // Initialize total amount
    let total =  latestRecord.totalamount

    console.log("total 1st :", total)

    // Add cost to total amount if present
    if (cost > 0) {
      total += cost;
    }

    console.log("cost : ", cost)
    console.log("pay : ", pay)
    // If pay is present and cost is 0, subtract pay from total amount
    if (pay > 0) {
      total -= pay;
    }



    console.log("total 2nd : " , total)
    // Convert startDate to Date object
    // const date = new Date(startDate);

    // Create and save the new record
    const newDriverMoreInfo = new DriverMoreInfo({
      driverId,
      driverName,
      vehicle,
      vehicleId,
      startDate: date,
      payment: cost,
      cost,
      pay,
      totalamount: total,
      registrationNumber,
      description,
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
