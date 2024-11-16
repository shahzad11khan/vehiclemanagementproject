import { connect } from "@config/db.js";
import VehicleRepair from "@models/VehicleRepair/VehicleRepair.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.VehicleRepairID;
    console.log("Vehicle Report", id);

    // Find all records related to the driverId
    // Find the product by ID
    // Attempt to find the user by ID
    const Find_User = await VehicleRepair.findById(id);
    console.log(Find_User);

    // Check if the user was found
    if (Find_User) {
      // User found, return the user data
      return NextResponse.json({ result: Find_User, status: 200 });
    } else {
      // If no user found, try to find by _id in an array
      const find_user_all = await VehicleRepair.find({ _id: id }).sort({
        createdAt: -1,
      });

      // Check if there are any records found
      if (find_user_all.length > 0) {
        // Return all records as a JSON response
        return NextResponse.json({ result: find_user_all, status: 200 });
      }

      // No records found
      return NextResponse.json({ result: "No User Found", status: 404 });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    // Return an error response
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}

// DELETE handler for deleting a vehicle and associated image
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();
    console.log(params);

    const { VehicleReportID } = params; // Access the VehicleID from params

    console.log("Vehicle ID:", VehicleReportID);

    // Find and delete the vehicle by its ID
    const deletedVehicle = await VehicleRepair.findById({
      _id: VehicleReportID,
    });
    // console.log(deletedVehicle);
    if (!deletedVehicle) {
      return NextResponse.json({
        error: "Vehicle not found",
        status: 404,
      });
    }

    console.log(deletedVehicle); // For debugging
    const deleted = await VehicleRepair.findByIdAndDelete({
      _id: VehicleReportID,
    });
    console.log(deleted);

    // Get the image public ID from the deleted vehicle object
    // Check if deletedVehicle exists and has images
    if (
      deletedVehicle &&
      deletedVehicle.images &&
      deletedVehicle.images.length > 0
    ) {
      // Iterate through each image in the array
      for (const image of deletedVehicle.images) {
        const imagePublicId = image.publicId;
        console.log("Deleting Cloudinary image with public ID:", imagePublicId);

        if (imagePublicId) {
          try {
            // Delete the image from Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.destroy(
              imagePublicId
            );

            console.log(
              `Cloudinary response for ${imagePublicId}: ${cloudinaryResponse.result}`
            );
          } catch (error) {
            console.error(
              `Failed to delete image ${imagePublicId} from Cloudinary:`,
              error
            );
          }
        }
      }
    } else {
      console.log("No images found for the deleted vehicle.");
    }

    // Return success response
    return NextResponse.json({
      message: "Vehicle deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the vehicle",
      status: 500,
    });
  }
};
