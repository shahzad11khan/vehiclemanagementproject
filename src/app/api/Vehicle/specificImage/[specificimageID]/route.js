import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function PUT(request, context) {
  try {
    await connect();

    const id = context.params.specificimageID;
    const data = await request.formData();

    // console.log(id);
    const userAvatar = data.get("imageFile");
    const imagepublicId = data.get("imagepublicId");
    let Vehicleavatar = "";
    let VehicleavatarId = "";
    const vehicle = await Vehicle.findOne({ "images._id": id });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found", status: 404 });
    }

    const imageToDelete = vehicle.images.find(
      (image) => image.publicId.toString() === imagepublicId
    );
    if (!imageToDelete) {
      console.error("Image not found with the given ID:", imageToDelete);
      return;
    }
    if (imageToDelete.publicId) {
      try {
        await cloudinary.uploader.destroy(imageToDelete.publicId);
        console.log("Image deleted from Cloudinary:", imageToDelete.publicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    if (userAvatar && typeof userAvatar === "object" && userAvatar.name) {
      const byteData = await userAvatar.arrayBuffer();
      const buffer = Buffer.from(byteData);

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

        uploadStream.end(buffer);
      });

      Vehicleavatar = uploadResponse.secure_url;
      VehicleavatarId = uploadResponse.public_id;

      //   console.log(Vehicleavatar, VehicleavatarId);
      const imageIndex = vehicle.images.findIndex(
        (image) => image._id.toString() === id
      );

      //   console.log(imageIndex);
      if (imageIndex !== -1) {
        vehicle.images[imageIndex].url = Vehicleavatar;
        vehicle.images[imageIndex].publicId = VehicleavatarId;
      }
      console.log("Image is Updated Successfully");
    }

    await vehicle.save();

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
