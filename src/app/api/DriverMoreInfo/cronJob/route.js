import { NextResponse } from "next/server";
import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
import Driver from "@models/Driver/Driver.Model.js";
export const GET = async () => {
  await connect();

  const drivers = await DriverMoreInfo.find({});
  for (const driver of drivers) {
    const latestRecord = await DriverMoreInfo.findOne({
      driverId: driver.driverId,
      vehicleId: driver.vehicleId,
      adminCompanyName: driver.adminCompanyName,
    }).sort({ startDate: -1 });

    // console.log("latestRecord",latestRecord)
    if (latestRecord) {
      const lastDate = new Date(latestRecord.startDate);
      const currentDate = new Date();
      console.log(lastDate , currentDate)
      const daysDifference = Math.floor(
        (currentDate - lastDate) / (1000 * 60 * 60 * 24)
      );
    //   console.log("dayDiff:", daysDifference)
      let shouldInsert = false;
      let totalamount = driver.payment;

      
      if (
          (driver.paymentcycle === "perday" && daysDifference >= 1)||(driver.paymentcycle === "perweek" && daysDifference >= 7)         
        ) {
            shouldInsert = true;
            totalamount += latestRecord.payment;
      }

    //   console.log("should",shouldInsert)
      if (shouldInsert) {
        await DriverMoreInfo.create({
          driverId: driver.driverId,
          driverName: driver.driverName,
          vehicle: driver.vehicle,
          vehicleId: driver.vehicleId,
          startDate: currentDate,
          paymentcycle: driver.paymentcycle,
          payment: driver.payment,
          totalamount,
          adminCreatedBy: driver.adminCreatedBy,
          adminCompanyName: driver.adminCompanyName,
          adminCompanyId: driver.adminCompanyId,
        });

        await Driver.findOneAndUpdate(
            { _id: driver.driverId }, // Find the driver by ID
            { $set: { totalamount: driver.payment } }, // Incase totalamount
            { new: true } // Return the updated document
        );
      }
    }
  }

  console.log("✅ Automatic record check completed");
  return NextResponse.json({ message: "Records checked & updated" });
};
