import { connect } from "@config/db.js";
import Driver from "@models/Driver/Driver.Model.js";
import cloudinary from "@middlewares/cloudinary.js";
import { NextResponse } from "next/server";

// PUT handler for updating driver details
export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.DrivId; // Use the correct parameter name
    const data = await request.formData();

    const userAvatar = data.get("imageFile");
    let Driveravatar = "";
    let DriveravatarId = "";

    // Check if the user avatar is an object and has a valid name (indicating it's a file)
    if (userAvatar && typeof userAvatar === "object" && userAvatar.name) {
      const byteData = await userAvatar.arrayBuffer();
      const buffer = Buffer.from(byteData);

      // Upload the new image to Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Write buffer to the upload stream
        uploadStream.end(buffer);
      });

      // Store the URL and ID of the uploaded image
      Driveravatar = uploadResponse.secure_url;
      DriveravatarId = uploadResponse.public_id;
    }

    // Convert FormData to a plain object
    const formDataObject = Object.fromEntries(data.entries());

    // Find the driver by ID
    const driver = await Driver.findById(id);
    if (!driver) {
      return NextResponse.json({ error: "Driver not found", status: 404 });
    }

    // Handle avatar update: remove old avatar from Cloudinary and update with new one if uploaded
    if (Driveravatar && DriveravatarId) {
      // Check if the driver has an existing avatar ID to delete
      if (driver.DriveravatarId) {
        try {
          // Delete old avatar from Cloudinary if it exists
          await cloudinary.uploader.destroy(driver.DriveravatarId);
          console.log("Old avatar deleted from Cloudinary.");
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Update driver with new avatar details
      driver.Driveravatar = Driveravatar;
      driver.DriveravatarId = DriveravatarId;
      console.log("New avatar uploaded and updated.");
    } else {
      // If no new avatar uploaded, retain the old image
      Driveravatar = driver.Driveravatar;
      DriveravatarId = driver.DriveravatarId;
    }

    // Update driver properties with values from formDataObject
    for (const key in formDataObject) {
      if (formDataObject[key] !== undefined) {
        driver[key] = formDataObject[key];
      }
    }

    // Save updated driver details
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

// GET handler for retrieving a specific product by ID
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.DrivId;
    console.log(id);

    // Find the product by ID
    const Find_User = await Driver.findById(id);

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
