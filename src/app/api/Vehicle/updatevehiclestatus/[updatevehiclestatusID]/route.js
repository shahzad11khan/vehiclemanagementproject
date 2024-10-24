// not conneted
import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";
// PUT handler for updating Vehicle details
export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.updatevehiclestatusID; // Use the correct parameter name
    const data = await request.formData();

    console.log(id);
    const userAvatar = data.get("imageFile");
    let Vehicleavatar = "";
    let VehicleavatarId = "";

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
      Vehicleavatar = uploadResponse.secure_url;
      VehicleavatarId = uploadResponse.public_id;
    }

    // Convert FormData to a plain object
    const formDataObject = Object.fromEntries(data.entries());

    // Find the Vehicle by ID
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found", status: 404 });
    }

    // Handle avatar update: remove old avatar from Cloudinary and update with new one if uploaded
    if (Vehicleavatar && VehicleavatarId) {
      // Check if the Vehicle has an existing avatar ID to delete
      if (vehicle.VehicleavatarId) {
        try {
          // Delete old avatar from Cloudinary if it exists
          await cloudinary.uploader.destroy(vehicle.VehicleavatarId);
          console.log("Old avatar deleted from Cloudinary.");
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Update Vehicle with new avatar details
      Vehicle.Vehicleavatar = Vehicleavatar;
      Vehicle.VehicleavatarId = VehicleavatarId;
      console.log("New avatar uploaded and updated.");
    } else {
      // If no new avatar uploaded, retain the old image
      Vehicleavatar = Vehicle.Vehicleavatar;
      VehicleavatarId = Vehicle.VehicleavatarId;
    }

    // Update Vehicle properties with values from formDataObject
    for (const key in formDataObject) {
      if (formDataObject[key] !== undefined) {
        Vehicle[key] = formDataObject[key];
      }
    }

    // Save updated Vehicle details
    await Vehicle.save();

    return NextResponse.json({
      message: "Vehicle details updated successfully",
      // Vehicle,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Vehicle details:", error);
    return NextResponse.json({
      error: "Failed to update Vehicle details",
      status: 500,
    });
  }
}
