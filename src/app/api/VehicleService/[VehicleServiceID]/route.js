import { connect } from "@config/db.js";
import VehicleService from "@models/VehicleService/VehicleService.Model.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.VehicleServiceID; // Extract ManufacturerID from params
    const data = await request.json(); // Get the form data

    console.log(id);
    console.log(data);

    // Destructure the necessary fields
    const {
      VehicleName,
      registrationNumber,
      serviceCurrentDate,
      serviceDueDate,
      serviceStatus,
      servicemailes,
      servicePending_Done,
      asignto,
      adminCreatedBy,
      adminCompanyName,
      adminCompanyId,
    } = data;

    // Find the manufacturer by ID
    const VehicleService = await VehicleService.findById({ _id: id });

    if (!VehicleService) {
      return NextResponse.json({
        error: "VehicleService not found",
        status: 404,
      });
    }

    // Update manufacturer properties with values from formDataObject or retain existing values
    VehicleService.VehicleName = VehicleName
      ? VehicleName
      : VehicleService.VehicleName; // Update name or retain existing
    VehicleService.registrationNumber = registrationNumber
      ? registrationNumber
      : VehicleService.registrationNumber; // Update description or retain existing
    VehicleService.serviceCurrentDate = serviceCurrentDate
      ? serviceCurrentDate
      : VehicleService.serviceCurrentDate;
    VehicleService.serviceDueDate = serviceDueDate
      ? serviceDueDate
      : VehicleService.serviceDueDate;
    VehicleService.serviceStatus = serviceStatus
      ? serviceStatus
      : VehicleService.serviceStatus;
    VehicleService.adminCreatedBy = adminCreatedBy
      ? adminCreatedBy
      : VehicleService.adminCreatedBy;
    VehicleService.adminCompanyName = adminCompanyName
      ? adminCompanyName
      : VehicleService.adminCompanyName;
    VehicleService.adminCompanyId = adminCompanyId
      ? adminCompanyId
      : VehicleService.adminCompanyId;
    VehicleService.asignto = asignto ? asignto : VehicleService.asignto;
    VehicleService.servicemailes = servicemailes
      ? servicemailes
      : VehicleService.servicemailes;
    VehicleService.servicePending_Done = servicePending_Done
      ? servicePending_Done
      : VehicleService.servicePending_Done;

    // Save the updated manufacturer
    await VehicleService.save();

    return NextResponse.json({
      message: "VehicleService details updated successfully",
      VehicleService, // Return the updated manufacturer object
      status: 200,
    });
  } catch (error) {
    console.error("Error updating VehicleService:", error);
    return NextResponse.json({
      error: "Failed to update VehicleService",
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
//     const id = context.params.VehicleServiceID; // Use context.params for accessing the parameters
//     console.log(id);

//     // Find the manufacturer by ID
//     const Find_VehicleService = await VehicleService.findById({ _id: id });

//     // Check if the manufacturer exists
//     if (!Find_VehicleService) {
//       return NextResponse.json({
//         result: "No VehicleService Found",
//         status: 404,
//       });
//     }

//     // Return the found manufacturer as a JSON response
//     return NextResponse.json({ result: Find_VehicleService, status: 200 });
//   } catch (error) {
//     console.error("Error fetching VehicleService:", error); // Log the error for debugging
//     return NextResponse.json({
//       result: "Failed to fetch VehicleService",
//       status: 500,
//     });
//   }
// };
// DELETE handler for deleting a manufacturer
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { VehicleServiceID } = params; // Access the ManufacturerID from params

    console.log("Manufacturer ID:", VehicleServiceID);

    // Find and delete the manufacturer
    const deletedManufacturer = await VehicleService.findByIdAndDelete(
      VehicleServiceID
    );

    if (!deletedManufacturer) {
      return NextResponse.json({
        error: "VehicleService not found",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "VehicleService deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting VehicleService:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the VehicleService",
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
    const id = params.VehicleServiceID;
    // console.log("Your ID is:", id);

    // Find all records related to the driverId
    const Find_User_All = await VehicleService.find({ VehicleId: id }).sort({
      createdAt: -1,
    });

    // If there are records associated with driverId
    if (Find_User_All.length > 0) {
      // Return all records as a JSON response
      return NextResponse.json({ result: Find_User_All, status: 200 });
    } else {
      // If no records found for driverId, try to find by _id
      const Find_User = await VehicleService.findById(id);

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
