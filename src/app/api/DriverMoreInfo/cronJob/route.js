import { NextResponse } from "next/server";
import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
// import Driver from "@models/Driver/Driver.Model.js";
export const GET = async () => {
  await connect();

  const drivers = await DriverMoreInfo.find({});
  for (const driver of drivers) {
    const latestRecord = await DriverMoreInfo.findOne({
      driverId: driver.driverId,
      vehicleId: driver.vehicleId,
      adminCompanyName: driver.adminCompanyName,
      registrationNumber:driver.registrationNumber
    }).sort({ startDate: -1 });

    // console.log("latest Record" + latestRecord);

    const latestRecordwithdate = await DriverMoreInfo.findOne({
      driverId: driver.driverId,
      vehicleId: driver.vehicleId,
      adminCompanyName: driver.adminCompanyName,
      registrationNumber:driver.registrationNumber
    }).sort({ createdAt: -1 });

    if (latestRecord) {
      const lastDate = new Date(latestRecord.startDate);
      const currentDate = new Date();
      const daysDifference = Math.floor(
        (currentDate - lastDate) / (1000 * 60 * 60 * 24)
      );
      
      let shouldInsert = false;
      let totalamount = driver.payment;

      console.log("1st total "+totalamount);
      if (
        (driver.paymentcycle === "perday" && daysDifference >= 1) ||
        (driver.paymentcycle === "perweek" && daysDifference >= 7)
      ) {
        shouldInsert = true;
        totalamount = latestRecordwithdate &&
        (latestRecordwithdate?.cost > 0 || latestRecordwithdate?.pay > 0)
        ? latestRecordwithdate.totalamount + (latestRecord?.payment || 0)
        : (latestRecord?.totalamount || 0) + driver.payment;

          // console.log("total amount is :"+totalamount)
      }

      console.log("total :"+totalamount)

      if (shouldInsert) {
        let newStartDate = new Date(lastDate); // Start from last recorded date
        while (newStartDate < currentDate) {
          // Move to the next day
          newStartDate.setDate(newStartDate.getDate() + 1);
          if (newStartDate >= currentDate) {
            break;
          }
          // Ensure total amount keeps increasing correctly
          // totalamount += driver.totalamount;
          console.log("total amount date check:", totalamount)
          await DriverMoreInfo.create({
            driverId: driver.driverId,
            driverName: driver.driverName,
            vehicle: driver.vehicle,
            vehicleId: driver.vehicleId,
            registrationNumber:driver.registrationNumber,
            startDate: new Date(newStartDate), // Save each missing day step by step
            paymentcycle: driver.paymentcycle,
            payment: driver.payment,
            totalamount, // Keep adding payment to total amount
            adminCreatedBy: driver.adminCreatedBy,
            adminCompanyName: driver.adminCompanyName,
            adminCompanyId: driver.adminCompanyId,
          });
        }

        // Update the total amount in the Driver collection
        // await Driver.findOneAndUpdate(
        //   { _id: driver.driverId },
        //   { $set: { totalamount } },
        //   { new: true }
        // );
      }


    }
  }

  console.log("✅ Automatic record check completed");
  return NextResponse.json({ message: "Records checked & updated" });
};