import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// export const PUT = async (request, context) => {
//   try {
//     await connect(); // Connect to the database

//     const id = context.params.DriverMoreInfoID; // Extract DriverMoreInfoID from params
//     const data = await request.json(); // Get the form data as JSON object

//     // Find the DriverMoreInfo by ID
//     const driverMoreInfo = await DriverMoreInfo.findById({ _id: id });
//     console.log(driverMoreInfo);

//     if (!driverMoreInfo) {
//       return NextResponse.json({
//         error: "DriverMoreInfo not found",
//         status: 404,
//       });
//     }

//     // Update DriverMoreInfo properties with values from data or retain existing values
//     driverMoreInfo.driverId = data.driverId || driverMoreInfo.driverId;
//     driverMoreInfo.totalamount = data.totalamount || driverMoreInfo.totalamount;
//     driverMoreInfo.totalsubtractamount =
//       data.totalsubtractamount || driverMoreInfo.totalsubtractamount;
//     driverMoreInfo.totalremainingamount =
//       data.totalremainingamount || driverMoreInfo.totalremainingamount;
//     driverMoreInfo.vehicle = data.vehicle || driverMoreInfo.vehicle;
//     driverMoreInfo.vehicleId = data.vehicleId || driverMoreInfo.vehicleId;
//     driverMoreInfo.paymentcycle =
//       data.paymentcycle || driverMoreInfo.paymentcycle;
//     driverMoreInfo.startDate = data.startDate || driverMoreInfo.startDate;
//     driverMoreInfo.calculation = data.calculation || driverMoreInfo.calculation;
//     driverMoreInfo.endDate = data.endDate || driverMoreInfo.endDate;
//     driverMoreInfo.subtractcalculation =
//       data.subtractcalculation || driverMoreInfo.subtractcalculation;
//     driverMoreInfo.remaining = data.remaining || driverMoreInfo.remaining;
//     driverMoreInfo.adminCreatedBy =
//       data.adminCreatedBy || driverMoreInfo.adminCreatedBy;
//     driverMoreInfo.adminCompanyId =
//       data.adminCompanyId || driverMoreInfo.adminCompanyId;
//     driverMoreInfo.adminCompanyId =
//       data.adminCreatedBy || driverMoreInfo.adminCreatedBy;
//     driverMoreInfo.adminCompanyName =
//       data.adminCompanyName || driverMoreInfo.adminCompanyName;

//     // Save the updated DriverMoreInfo
//     await driverMoreInfo.save();

//     return NextResponse.json({
//       message: "DriverMoreInfo details updated successfully",
//       DriverMoreInfo,
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error updating DriverMoreInfo:", error);
//     return NextResponse.json({
//       error: "Failed to update DriverMoreInfo",
//       details: error.message,
//       status: 500,
//     });
//   }
// };

// GET handler for retrieving a specific driver by ID
// GET handler for retrieving a specific product by ID
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.DriverMoreInfoID;
    // console.log("driver payment id is:", id);

    // Find all records related to the driverId
    const find_user_all = await DriverMoreInfo.find({ driverId: id }).sort({
      createdAt: -1,
    });
    // console.log(find_user_all);

    // If there are records associated with driverId
    if (find_user_all.length > 0) {
      // Return all records as a JSON response
      return NextResponse.json({ result: find_user_all, status: 200 });
    } else {
      // If no records found for driverId, try to find by _id
      const Find_User = await DriverMoreInfo.findById(id);

      // Check if the product exists
      if (!Find_User) {
        return NextResponse.json({ result: [], status: 404 });
      } else {
        // Return the found product as a JSON response
        return NextResponse.json({ result: Find_User, status: 200 });
      }
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    // Return an error response
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}

export const DELETE = async (request, context) => {
  try {
    await connect();

    const id = context.params.DriverMoreInfoID; // Ensure DriverMoreInfoID is correctly passed
    console.log("DriverMoreInfo ID:", id);

    let deletedDriverMoreInfo = await DriverMoreInfo.findOneAndDelete({
      _id: id,
    });

    // console.log(deletedDriverMoreInfo);
    if (!deletedDriverMoreInfo) {
      return NextResponse.json({
        message: "DriverMoreInfo not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "DriverMoreInfo deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting DriverMoreInfo:", error); // Log the error for debugging
    return NextResponse.json({
      message: "An error occurred while deleting the DriverMoreInfo",
      error: error.message, // Provide error details for easier debugging
      status: 500,
    });
  }
};


export async function PUT(request) {
  try {
    await connect(); // Connect to the database

    // const id = context.params.DriverMoreInfoIDD; // ✅ Correct parameter name
    const data = await request.formData(); // ✅ Using formData since frontend is sending multipart form-data
    const formDataObject = Object.fromEntries(data.entries());
    const {driverId, vehicleId, startDate, cost, pay, discription } = formDataObject;
    console.log("Received ID:", driverId, vehicleId, startDate, cost, pay, discription);
    if (!vehicleId) {
      return NextResponse.json({
        error: "vehicleId is required",
        status: 400,
      });
    }
    const startdt = new Date(startDate);
    console.log("startdate", startdt)
    if (isNaN(startdt.getTime())) {
      return NextResponse.json(
        { error: "Invalid Start Date format", status: 400 },
        { status: 400 }
      );
    }
  

    // Find the driver by driverId and startDate
    const driver = await DriverMoreInfo.findOne({
      driverId: driverId,
      vehicleId: vehicleId,
      startDate: startdt
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found", status: 404 });
    }

    // ✅ Properly update fields only if they exist
 // Preserve old cost if cost is 0, otherwise update it
// driver.cost = cost === 0 || cost === null ? driver.cost : Number(cost);

if(cost === 0 || cost === null){
  driver.cost = driver.cost;
}
else{
  driver.cost += Number(cost);
}

if(pay === 0 || pay === null){
  driver.pay = driver.pay;
}
else{
  driver.pay += Number(pay);
}

if(discription === "" || discription === null){
  driver.discription = driver.discription;
}
else{
  driver.discription = discription;
}
// Preserve old description if it's an empty string, otherwise update it
// Update totalamount correctly
// const updatedTotalAmount = (driver.totalamount || 0) + (Number(cost) || 0) - (Number(pay) || 0);
// driver.totalamount = updatedTotalAmount;


    // ✅ Save updated driver details
    await driver.save();

    return NextResponse.json({
      message: "Driver details updated successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error updating driver details:", error);
    return NextResponse.json({
      error: "Failed to update driver details",
      status: 500,
    });
  }
}

