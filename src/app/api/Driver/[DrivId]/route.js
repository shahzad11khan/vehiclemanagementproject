import { connect } from "@config/db.js";
import Driver from "@models/Driver/Driver.Model.js";
import cloudinary from "@middlewares/cloudinary.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT handler for updating driver details
export async function PUT(request, { params }) {
  try {
    await connect(); // Connect to the database

    const id = params.UserID; // Use the correct parameter name
    const data = await request.formData();

    const userAvatar = data.get("imageUrl");
    let Driveravatar = "";
    let DriveravatarId = "";

    // Helper function to upload images to Cloudinary
    const uploadToCloudinary = async (file) => {
      if (!file) return null; // Return null if no file
      const buffer = Buffer.from(await file.arrayBuffer());
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) return reject(error); // Reject on error
            resolve(result); // Resolve with the upload result
          })
          .end(buffer);
      });
    };

    // Handle user avatar upload or use existing URL
    if (userAvatar) {
      const uploadResponse = await uploadToCloudinary(userAvatar);
      if (uploadResponse) {
        Driveravatar = uploadResponse.secure_url;
        DriveravatarId = uploadResponse.public_id;
      }
    }

    // Convert FormData to a plain object
    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      formDataObject[key] = value;
    }

    // Find the driver by ID
    const driver = await Driver.findById(id);
    if (!driver) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    // Update driver properties with values from formDataObject or retain existing values
    Object.assign(driver, {
      ...formDataObject,
      Driveravatar: Driveravatar || driver.Driveravatar,
      DriveravatarId: DriveravatarId || driver.DriveravatarId,
    });

    await driver.save();

    return NextResponse.json({
      message: "Driver details updated successfully",
      driver,
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

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.DrivId; // Ensure you're using the correct parameter name
  console.log("Driver ID:", id);

  // Find the driver by ID
  const Find_Driver = await Driver.findById(id);
  if (!Find_Driver) {
    return NextResponse.json({ result: "No Driver Found", status: 404 });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Driver, status: 200 });
});

// DELETE handler for deleting a driver and associated image
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { DrivId } = params; // Access the Driver ID from params
    console.log("Driver ID:", DrivId);

    // Find the driver by ID
    const driver = await Driver.findById({ _id: DrivId });
    if (!driver) {
      return NextResponse.json({ message: "Driver not found", status: 404 });
    }

    // Get the image public ID from the driver object (ensure the field matches your schema)
    const imagePublicId = driver.imagePublicId;
    console.log("Image Public ID:", imagePublicId);

    // Delete the driver from the database
    const deletedDriver = await Driver.findByIdAndDelete({ _id: DrivId });
    if (!deletedDriver) {
      return NextResponse.json({ error: "Driver not found", status: 404 });
    }

    // If the driver has an associated image, delete it from Cloudinary
    if (imagePublicId) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.destroy(
          imagePublicId
        );
        console.log(`Cloudinary response: ${cloudinaryResponse.result}`);
        if (cloudinaryResponse.result !== "ok") {
          console.error("Failed to delete image from Cloudinary");
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return NextResponse.json({
          error: "Failed to delete image from Cloudinary",
          status: 500,
        });
      }
    }

    // Return success response
    return NextResponse.json({
      message: "Driver and associated image deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting driver:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the driver",
      status: 500,
    });
  }
};
