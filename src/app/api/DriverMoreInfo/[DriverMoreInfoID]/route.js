import { connect } from "@config/db.js";
import DriverMoreInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.DriverMoreInfoID; // Extract DriverMoreInfoID from params
    const data = await request.json(); // Get the form data as JSON object

    // Find the DriverMoreInfo by ID
    const driverMoreInfo = await DriverMoreInfo.findById({ _id: id });
    console.log(driverMoreInfo);

    if (!driverMoreInfo) {
      return NextResponse.json({
        error: "DriverMoreInfo not found",
        status: 404,
      });
    }

    // Update DriverMoreInfo properties with values from data or retain existing values
    driverMoreInfo.driverId = data.driverId || driverMoreInfo.driverId;
    driverMoreInfo.totalamount = data.totalamount || driverMoreInfo.totalamount;
    driverMoreInfo.totalsubtractamount =
      data.totalsubtractamount || driverMoreInfo.totalsubtractamount;
    driverMoreInfo.totalremainingamount =
      data.totalremainingamount || driverMoreInfo.totalremainingamount;
    driverMoreInfo.vehicle = data.vehicle || driverMoreInfo.vehicle;
    driverMoreInfo.paymentcycle =
      data.paymentcycle || driverMoreInfo.paymentcycle;
    driverMoreInfo.startDate = data.startDate || driverMoreInfo.startDate;
    driverMoreInfo.calculation = data.calculation || driverMoreInfo.calculation;
    driverMoreInfo.endDate = data.endDate || driverMoreInfo.endDate;
    driverMoreInfo.subtractcalculation =
      data.subtractcalculation || driverMoreInfo.subtractcalculation;
    driverMoreInfo.remaining = data.remaining || driverMoreInfo.remaining;
    driverMoreInfo.adminCreatedBy =
      data.adminCreatedBy || driverMoreInfo.adminCreatedBy;
    driverMoreInfo.adminCompanyId =
      data.adminCompanyId || driverMoreInfo.adminCompanyId;
    driverMoreInfo.adminCompanyId =
      data.adminCreatedBy || driverMoreInfo.adminCreatedBy;
    driverMoreInfo.adminCompanyName =
      data.adminCompanyName || driverMoreInfo.adminCompanyName;

    // Save the updated DriverMoreInfo
    await driverMoreInfo.save();

    return NextResponse.json({
      message: "DriverMoreInfo details updated successfully",
      DriverMoreInfo,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating DriverMoreInfo:", error);
    return NextResponse.json({
      error: "Failed to update DriverMoreInfo",
      details: error.message,
      status: 500,
    });
  }
};

// GET handler for retrieving a specific driver by ID
// GET handler for retrieving a specific product by ID
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.DriverMoreInfoID;
    console.log(id);

    // Find the product by ID
    const Find_User = await DriverMoreInfo.findOne({ driverId: id });

    // Check if the product exists
    if (!Find_User) {
      return NextResponse.json({ result: "no user Found", status: 404 });
    } else {
      // Return the found product as a JSON response
      return NextResponse.json({ result: Find_User, status: 200 });
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
    let deletedDriverMoreInfo;
    if (await DriverMoreInfo.exists({ _id: id })) {
      // If 'id' is a valid MongoDB ObjectId, delete by _id
      deletedDriverMoreInfo = await DriverMoreInfo.findOneAndDelete({
        _id: id,
      });
    } else {
      // Otherwise, delete by driverId
      deletedDriverMoreInfo = await DriverMoreInfo.findOneAndDelete({
        driverId: id,
      });
    }

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
