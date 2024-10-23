import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.specificimageID; // Use the correct parameter name
    const data = await request.formData();

    console.log(id);
    const userAvatar = data.get("imageFile");
    console.log(userAvatar);
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

    // Assuming 'id' is the image ID you want to search for
    const vehicle = await Vehicle.findOne({ "images._id": id });
    console.log(vehicle);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found", status: 404 });
    }

    // Handle avatar update: remove old avatar from Cloudinary and update with new one if uploaded
    if (Vehicleavatar && VehicleavatarId) {
      // Check if the Vehicle has an existing avatar ID to delete
      if (vehicle.images.publicId) {
        try {
          // Delete old avatar from Cloudinary if it exists
          await cloudinary.uploader.destroy(vehicle.images.publicId);
          console.log("Old avatar deleted from Cloudinary.");
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Update Vehicle with new avatar details
      vehicle.images.url = Vehicleavatar;
      vehicle.images.publicId = VehicleavatarId; // Fix: Ensure this is updated correctly
      console.log("New avatar uploaded and updated.");
    } else {
      console.log("No new image uploaded, keeping the old image.");
    }

    // Save updated Vehicle details
    await vehicle.save(); // Save the vehicle instance to apply changes

    return NextResponse.json({
      message: "Vehicle image updated successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error updating Vehicle image:", error);
    return NextResponse.json({
      error: "Failed to update Vehicle image",
      status: 500,
    });
  }
}
