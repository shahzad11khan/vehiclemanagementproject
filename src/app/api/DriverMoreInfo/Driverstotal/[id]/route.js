// import { NextResponse } from "next/server";
// import { connect } from "@config/db.js";
// import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
// import DriverVehicleAllotment from "@models/DriverVehicleAllotment/DriverVehicleAllotment.Model.js";
// import Driver from "@models/Driver/Driver.Model.js";

// export const GET = async (request,context) => {
//   await connect(); // Ensure database connection

//   const id = context.params.id;
//   console.log(id);
//   const Find_User_All = await DriverVehicleAllotment.find({ driverId: id });
//   // 🔹 Fetch all driver records
//   const driver = await DriverMoreInfo.find({driverId:Find_User_All.driverId , vehicleId:Find_User_All.vehicleId:registrationNumber:Find_User_All.registrationNumber});

//   let totalPayment = 0;
//   let totalCost = 0;
//   let totalPay = 0;

//     totalPayment += driver.payment || 0;
//     totalCost += driver.cost || 0;
//     totalPay += driver.pay || 0;

//   // 🔹 Calculate the remaining amount
//   const remainingAmount = totalPayment - totalPay;

//   console.log("✅ Total Calculated:", {
//     totalPayment,
//     totalCost,
//     totalPay,
//     remainingAmount
//   });

//   for (const driver of drivers) {
//     if (driver.driverId) {
//       await Driver.findOneAndUpdate(
//         { _id: driver.driverId },
//         { $set: { totalamount: remainingAmount } }, // Change `totalamount` to your actual field name
//         { new: true }
//       );
//     }
//   }

//   return NextResponse.json({
//     dirverId: drivers[0].driverId,
//     message: "Totals calculated successfully",
//     totalPayment,
//     totalCost,
//     totalPay,
//     remainingAmount
//   });
// };

import { NextResponse } from "next/server";
import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
import Driver from "@models/Driver/Driver.Model.js";

export const GET = async (request,context) => {
  await connect(); // Ensure database connection

  const { searchParams } = new URL(request.url);
  const driverId = searchParams.get("driverId");
  const vehicleId = searchParams.get("vehicleId");
  console.log("Driver ID:", driverId);
  console.log("Vehicle ID:", vehicleId);
  const id = context.params.id;
  // console.log("Driver ID:", id);
  const drivers = await DriverMoreInfo.find({driverId:id,vehicleId:vehicleId});
  // console.log('drivers',drivers)

  let totalPayment = 0;
  let totalCost = 0;
  let totalPay = 0;

  // 🔹 Calculate totals for each driver
  for (const driver of drivers) {
    totalPayment += driver.payment || 0;
    totalCost += driver.cost || 0;
    totalPay += driver.pay || 0;
  }

  // 🔹 Calculate the remaining amount
  const remainingAmount = totalPayment - totalPay;

  console.log("✅ Total Calculated:", {
    totalPayment,
    totalCost,
    totalPay,
    remainingAmount
  });

  // 🔹 Update the `Driver` model with the remaining amount
  for (const driver of drivers) {
    if (driver.driverId) {
      await Driver.findOneAndUpdate(
        { _id: driver.driverId },
        { $set: { totalAmount: remainingAmount } }, // Ensure correct field name
        { new: true }
      );
    }
  }

  return NextResponse.json({
    driverId: drivers[0]?.driverId,
    // registrationNumbers, // Include all associated registration numbers
    message: "Totals calculated successfully",
    totalPayment,
    totalCost,
    totalPay,
    remainingAmount
  });
};
