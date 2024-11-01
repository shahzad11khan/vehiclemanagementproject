import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function PUT(request, context) {
  try {
    await connect();

    const id = context.params.specificimageID;
    const data = await request.formData();

    console.log(id);

    // console.log(id);
    const userAvatar = data.get("imageFile");
    const imagepublicId = data.get("imagepublicId");
    let Vehicleavatar = "";
    let VehicleavatarId = "";
    let vehicle = await Vehicle.findOne({ "images._id": id });
    if (!vehicle) {
      vehicle = await Vehicle.findOne({ "damageImage._id": id });
    }
    // Try to find the image in the main images array
    let imageToDelete = vehicle.images.find(
      (image) => image.publicId.toString() === imagepublicId
    );

    if (!imageToDelete) {
      // If not found in images, try to find it in damageImage array
      imageToDelete = vehicle.damageImage.find(
        (damageImage) => damageImage.publicId.toString() === imagepublicId
      );
    }

    console.log(imageToDelete);
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
      let imageIndex = vehicle.images.findIndex(
        (image) => image._id.toString() === id
      );

      let inImagesArray = true;

      if (imageIndex === -1) {
        imageIndex = vehicle.damageImage.findIndex(
          (damage) => damage._id.toString() === id
        );
        inImagesArray = false;
      }

      //   console.log(imageIndex);
      if (imageIndex !== -1) {
        if (inImagesArray) {
          vehicle.images[imageIndex].url = Vehicleavatar;
          vehicle.images[imageIndex].publicId = VehicleavatarId;
        } else {
          vehicle.damageImage[imageIndex].url = Vehicleavatar;
          vehicle.damageImage[imageIndex].publicId = VehicleavatarId;
        }
        console.log("Image is updated successfully");
      }
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
