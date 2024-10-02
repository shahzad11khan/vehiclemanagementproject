import { connect } from "@config/db.js";
import Company from "@models/Company/Company.Model.js";
import cloudinary from "@middlewares/cloudinary.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT handler for updating driver details
export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.CompID; // Use the correct parameter name
    const data = await request.formData(); // Get form data

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

    // Find the driver by ID
    const driver = await Company.findById(id);
    if (!driver) {
      return NextResponse.json({ error: "Driver not found", status: 404 });
    }

    // Handle user avatar upload if a new image is provided, otherwise retain the old image
    if (userAvatar && userAvatar.size > 0) {
      // Check if a file is uploaded
      const uploadResponse = await uploadToCloudinary(userAvatar);
      if (uploadResponse) {
        Driveravatar = uploadResponse.secure_url;
        DriveravatarId = uploadResponse.public_id;
      }
    } else {
      // Retain existing avatar if no new image is uploaded
      Driveravatar = driver.Driveravatar;
      DriveravatarId = driver.DriveravatarId;
    }

    // Convert FormData to a plain object and update driver properties
    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      formDataObject[key] = value;
    }

    // Update driver properties directly
    driver.Driveravatar = Driveravatar;
    driver.DriveravatarId = DriveravatarId;

    // Update other properties
    for (const key in formDataObject) {
      if (formDataObject.hasOwnProperty(key)) {
        driver[key] = formDataObject[key];
      }
    }

    await driver.save(); // Save updated driver details

    return NextResponse.json({
      message: "Company details updated successfully",
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
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.CompID;
    console.log(id);

    // Find the product by ID
    const Find_User = await Company.findById(id);

    // Check if the product exists
    if (!Find_User) {
      return NextResponse.json({ result: "No User Found", status: 404 });
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

// DELETE handler for deleting a driver and associated image
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { CompID } = params; // Access the Driver ID from params
    console.log("Driver ID:", CompID);

    // Find the driver by ID
    const driver = await Company.findById({ _id: CompID });
    if (!driver) {
      return NextResponse.json({ message: "Driver not found", status: 404 });
    }

    // Get the image public ID from the driver object (ensure the field matches your schema)
    const imagePublicId = driver.imagePublicId;
    console.log("Image Public ID:", imagePublicId);

    // Delete the driver from the database
    const deletedDriver = await Company.findByIdAndDelete({ _id: CompID });
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
