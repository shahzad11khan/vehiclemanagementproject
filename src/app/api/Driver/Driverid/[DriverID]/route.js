import { connect } from "@config/db.js";
import Driver from "@models/Driver/Driver.Model.js";
import { NextResponse } from "next/server";
// PUT handler for updating driver details
export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.DriverID; // Use the correct parameter name
    const data = await request.formData();

    console.log(id);
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
