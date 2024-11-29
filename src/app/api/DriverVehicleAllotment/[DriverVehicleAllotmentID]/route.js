import { connect } from "@config/db.js";
import DriverVehicleAllotment from "@models/DriverVehicleAllotment/DriverVehicleAllotment.Model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.DriverVehicleAllotmentID; // Extract DriverVehicleAllotmentID from params
    console.log("update id is", id);
    const data = await request.json(); // Get the form data as JSON object

    // Find the DriverVehicleAllotment by ID
    const driverVehicleallotment = await DriverVehicleAllotment.findById({
      _id: id,
    });
    // console.log(driverVehicleallotment);

    if (!driverVehicleallotment) {
      return NextResponse.json({
        error: "DriverVehicleAllotment not found",
        status: 404,
      });
    }

    // Update DriverVehicleAllotment properties with values from data or retain existing values
    driverVehicleallotment.driverId =
      data.driverId || driverVehicleallotment.driverId;
    driverVehicleallotment.driverName =
      data.driverName || driverVehicleallotment.driverName;

    driverVehicleallotment.vehicle =
      data.vehicle || driverVehicleallotment.vehicle;
    driverVehicleallotment.vehicleId =
      data.vehicleId || driverVehicleallotment.vehicleId;
    driverVehicleallotment.paymentcycle =
      data.paymentcycle || driverVehicleallotment.paymentcycle;
    driverVehicleallotment.startDate =
      data.startDate || driverVehicleallotment.startDate;
    driverVehicleallotment.payment =
      data.payment || driverVehicleallotment.payment;

    driverVehicleallotment.adminCreatedBy =
      data.adminCreatedBy || driverVehicleallotment.adminCreatedBy;
    driverVehicleallotment.adminCompanyId =
      data.adminCompanyId || driverVehicleallotment.adminCompanyId;
    driverVehicleallotment.adminCompanyId =
      data.adminCreatedBy || driverVehicleallotment.adminCreatedBy;
    driverVehicleallotment.adminCompanyName =
      data.adminCompanyName || driverVehicleallotment.adminCompanyName;

    // Save the updated DriverVehicleAllotment
    await driverVehicleallotment.save();

    return NextResponse.json({
      message: "DriverVehicleAllotment details updated successfully",
      driverVehicleallotment,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating DriverVehicleAllotment:", error);
    return NextResponse.json({
      error: "Failed to update DriverVehicleAllotment",
      details: error.message,
      status: 500,
    });
  }
};

// GET handler for retrieving a specific product by ID
export async function GET(request, { params }) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = params.DriverVehicleAllotmentID;
    // console.log("Your ID is:", id);

    // Find all records related to the driverId
    const Find_User_All = await DriverVehicleAllotment.find({ driverId: id });

    // If there are records associated with driverId
    if (Find_User_All.length > 0) {
      // Return all records as a JSON response
      return NextResponse.json({ result: Find_User_All, status: 200 });
    } else {
      // If no records found for driverId, try to find by _id
      const Find_User = await DriverVehicleAllotment.findById(id);

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

    const id = context.params.DriverVehicleAllotmentID;
    console.log("DriverVehicleAllotment ID:", id);

    let deletedDriverVehicleAllotment =
      await DriverVehicleAllotment.findOneAndDelete({
        _id: id,
      });

    // console.log(deletedDriverVehicleAllotment);
    if (!deletedDriverVehicleAllotment) {
      return NextResponse.json({
        message: "DriverVehicleAllotment not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "DriverVehicleAllotment deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting DriverVehicleAllotment:", error); // Log the error for debugging
    return NextResponse.json({
      message: "An error occurred while deleting the DriverVehicleAllotment",
      error: error.message, // Provide error details for easier debugging
      status: 500,
    });
  }
};
