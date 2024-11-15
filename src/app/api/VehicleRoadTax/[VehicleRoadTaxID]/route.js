import { connect } from "@config/db.js";
import VehicleRoadTax from "@models/VehicleRoadTax/VehicleRoadTax.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.VehicleRoadTaxID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const {
      VehicleName,
      registrationNumber,
      roadtexCurrentDate,
      roadtexDueDate,
      roadtexStatus,
      roadtexCycle,
      asignto,
      roadtexPending_Done,
      adminCreatedBy,
      adminCompanyName,
      adminCompanyId,
    } = data;

    // Find the manufacturer by ID
    const VehicleRoadTax = await VehicleRoadTax.findById({ _id: id });

    if (!VehicleRoadTax) {
      return NextResponse.json({
        error: "VehicleRoadTax not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    VehicleRoadTax.VehicleName = VehicleName
      ? VehicleName
      : VehicleRoadTax.VehicleName; // Update name or retain existing
    VehicleRoadTax.registrationNumber = registrationNumber
      ? registrationNumber
      : VehicleRoadTax.registrationNumber; // Update description or retain existing
    VehicleRoadTax.serviceCurrentDate = serviceCurrentDate
      ? serviceCurrentDate
      : VehicleRoadTax.roadtexCurrentDate;
    VehicleRoadTax.roadtexCurrentDate = roadtexCurrentDate
      ? roadtexCurrentDate
      : VehicleRoadTax.roadtexCurrentDate;
    VehicleRoadTax.roadtexDueDate = roadtexDueDate
      ? roadtexDueDate
      : VehicleRoadTax.roadtexDueDate;
    VehicleRoadTax.roadtexStatus = roadtexStatus
      ? roadtexStatus
      : VehicleRoadTax.roadtexStatus;
    VehicleRoadTax.adminCreatedBy = adminCreatedBy
      ? adminCreatedBy
      : VehicleRoadTax.adminCreatedBy;
    VehicleRoadTax.adminCompanyName = adminCompanyName
      ? adminCompanyName
      : VehicleRoadTax.adminCompanyName;
    VehicleRoadTax.adminCompanyId = adminCompanyId
      ? adminCompanyId
      : VehicleRoadTax.adminCompanyId;
    VehicleRoadTax.asignto = asignto ? asignto : VehicleRoadTax.asignto;
    VehicleRoadTax.roadtexCycle = roadtexCycle
      ? roadtexCycle
      : VehicleRoadTax.roadtexCycle;
    VehicleRoadTax.roadtexPending_Dones = roadtexPending_Done
      ? roadtexPending_Done
      : VehicleRoadTax.roadtexPending_Done;

    // Save the updated manufacturer
    await VehicleRoadTax.save();

    return NextResponse.json({
      message: "VehicleRoadTax details updated successfully",
      VehicleRoadTax, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating VehicleRoadTax:", error);
    return NextResponse.json({
      error: "Failed to update VehicleRoadTax",
      status: 500,
    });
  }
};

// // GET handler for retrieving a specific manufacturer by ID
// export const GET = async (request, context) => {
//   try {
//     // Connect to the database
//     await connect();

//     // Extract the Manufacturer ID from the request parameters
//     const id = context.params.VehicleRoadTaxID; // Use context.params for accessing the parameters
//     console.log(id);

//     // Find the manufacturer by ID
//     const Find_VehicleRoadTax = await VehicleRoadTax.findById({ _id: id });

//     // Check if the manufacturer exists
//     if (!Find_VehicleRoadTax) {
//       return NextResponse.json({
//         result: "No VehicleRoadTax Found",
//         status: 404,
//       });
//     }

//     // Return the found manufacturer as a JSON response
//     return NextResponse.json({ result: Find_VehicleRoadTax, status: 200 });
//   } catch (error) {
//     console.error("Error fetching VehicleRoadTax:", error); // Log the error for debugging
//     return NextResponse.json({
//       result: "Failed to fetch VehicleRoadTax",
//       status: 500,
//     });
//   }
// };
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { VehicleRoadTaxID } = params; // Access the ManufacturerID from params

    console.log("roadtex ID:", VehicleRoadTaxID);

    // Find and delete the manufacturer
    const deletedManufacturer = await VehicleRoadTax.findByIdAndDelete(
      VehicleRoadTaxID
    );

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "VehicleRoadTax not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "VehicleRoadTax deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting VehicleRoadTax:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the VehicleRoadTax",
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
    console.log(params);
    const id = params.VehicleRoadTaxID;
    // console.log("Your ID is:", id);

    // Find all records related to the driverId
    const Find_User_All = await VehicleRoadTax.find({ VehicleId: id });

    // If there are records associated with driverId
    if (Find_User_All.length > 0) {
      // Return all records as a JSON response
      return NextResponse.json({ result: Find_User_All, status: 200 });
    } else {
      // If no records found for driverId, try to find by _id
      const Find_User = await VehicleRoadTax.findById(id);

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
