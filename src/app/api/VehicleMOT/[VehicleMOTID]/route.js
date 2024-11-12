import { connect } from "@config/db.js";
import VehicleMOT from "@models/VehicleMOT/VehicleMOT.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.VehicleMOTID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const {
      VehicleName,
      registrationNumber,
      motCurrentDate,
      motDueDate,
      motCycle,
      motStatus,
      asignto,
      adminCreatedBy,
      adminCompanyName,
      adminCompanyId,
    } = data;

    // Find the manufacturer by ID
    const VehicleMOT = await VehicleMOT.findById({ _id: id });

    if (!VehicleMOT) {
      return NextResponse.json({
        error: "VehicleMOT not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    VehicleMOT.VehicleName = VehicleName ? VehicleName : VehicleMOT.VehicleName; // Update name or retain existing
    VehicleMOT.registrationNumber = registrationNumber
      ? registrationNumber
      : VehicleMOT.registrationNumber; // Update description or retain existing
    VehicleMOT.motCurrentDate = motCurrentDate
      ? motCurrentDate
      : VehicleMOT.motCurrentDate;
    VehicleMOT.motDueDate = motDueDate ? motDueDate : VehicleMOT.motDueDate;
    VehicleMOT.motCycle = motCycle ? motCycle : VehicleMOT.motCycle;
    VehicleMOT.motStatus = motStatus ? motStatus : VehicleMOT.motStatus;
    VehicleMOT.adminCreatedBy = adminCreatedBy
      ? adminCreatedBy
      : VehicleMOT.adminCreatedBy;
    VehicleMOT.adminCompanyName = adminCompanyName
      ? adminCompanyName
      : VehicleMOT.adminCompanyName;
    VehicleMOT.adminCompanyId = adminCompanyId
      ? adminCompanyId
      : VehicleMOT.adminCompanyId;
    VehicleMOT.asignto = asignto ? asignto : VehicleMOT.asignto;

    // Save the updated manufacturer
    await VehicleMOT.save();

    return NextResponse.json({
      message: "VehicleMOT details updated successfully",
      VehicleMOT, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating VehicleMOT:", error);
    return NextResponse.json({
      error: "Failed to update VehicleMOT",
      status: 500,
    });
  }
};

// GET handler for retrieving a specific manufacturer by ID
export const GET = async (request, context) => {
  try {
    // Connect to the database
    await connect();

    // Extract the Manufacturer ID from the request parameters
    const id = context.params.VehicleMOTID; // Use context.params for accessing the parameters
    console.log(id);

    // Find the manufacturer by ID
    const Find_VehicleMOT = await VehicleMOT.findById({ _id: id });

    // Check if the manufacturer exists
    if (!Find_VehicleMOT) {
      return NextResponse.json({
        result: "No VehicleMOT Found",
        status: 404,
      });
    }

    // Return the found manufacturer as a JSON response
    return NextResponse.json({ result: Find_VehicleMOT, status: 200 });
  } catch (error) {
    console.error("Error fetching VehicleMOT:", error); // Log the error for debugging
    return NextResponse.json({
      result: "Failed to fetch VehicleMOT",
      status: 500,
    });
  }
};
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { VehicleMOTID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", VehicleMOTID);

    // Find and delete the manufacturer
    const deletedManufacturer = await VehicleMOT.findByIdAndDelete(
      VehicleMOTID
    );

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "VehicleMOT not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "VehicleMOT deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting VehicleMOT:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the VehicleMOT",
      status: 500,
    });
  }
};
