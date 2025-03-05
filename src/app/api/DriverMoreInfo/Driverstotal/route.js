import { NextResponse } from "next/server";
import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
import Driver from "@models/Driver/Driver.Model.js";

export const GET = async () => {
  await connect(); // Ensure database connection

  // 🔹 Fetch all driver records
  const drivers = await DriverMoreInfo.find({});

  let totalPayment = 0;
  let totalCost = 0;
  let totalPay = 0;

  for (const driver of drivers) {
    totalPayment += driver.payment || 0;
    totalCost += driver.cost || 0;
    totalPay += driver.pay || 0;
  }

  // 🔹 Calculate the remaining amount
  const remainingAmount = totalPayment + totalCost - totalPay;

  console.log("✅ Total Calculated:", {
    totalPayment,
    totalCost,
    totalPay,
    remainingAmount
  });

  for (const driver of drivers) {
    if (driver.driverId) {
      await Driver.findOneAndUpdate(
        { _id: driver.driverId },
        { $set: { totalamount: remainingAmount } }, // Change `totalamount` to your actual field name
        { new: true }
      );
    }
  }

  return NextResponse.json({
    dirverId: drivers[0].driverId,
    message: "Totals calculated successfully",
    totalPayment,
    totalCost,
    totalPay,
    remainingAmount
  });
};
