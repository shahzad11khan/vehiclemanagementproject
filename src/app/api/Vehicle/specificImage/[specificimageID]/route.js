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
    if (!vehicle) {
      vehicle = await Vehicle.findOne({ "cardocuments._id": id });
    }

    if (!vehicle) {
      // If no vehicle found, handle this case (e.g., return an error or exit)
      throw new Error("Vehicle not found with the specified image ID");
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

    if (!imageToDelete) {
      // If not found in damageImage, try to find it in cardocuments array
      imageToDelete = vehicle.cardocuments.find(
        (cardocument) => cardocument.publicId.toString() === imagepublicId
      );
    }

    if (!imageToDelete) {
      throw new Error(
        "Image with the specified public ID not found in any array"
      );
    }

    // Proceed with the deletion process

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

      // console.log(Vehicleavatar, VehicleavatarId);
      let imageIndex = vehicle.images.findIndex(
        (image) => image._id.toString() === id
      );

      let imageLocation = "images"; // Track which array contains the image

      if (imageIndex === -1) {
        imageIndex = vehicle.damageImage.findIndex(
          (damage) => damage._id.toString() === id
        );
        if (imageIndex !== -1) {
          imageLocation = "damageImage"; // Update location if found in damageImage
        }
      }

      if (imageIndex === -1) {
        imageIndex = vehicle.cardocuments.findIndex(
          (cardo) => cardo._id.toString() === id
        );
        if (imageIndex !== -1) {
          imageLocation = "cardocuments"; // Update location if found in cardocuments
        }
      }

      // After determining the location, you can use imageIndex and imageLocation as needed
      if (imageIndex === -1) {
        throw new Error("Image with the specified ID not found in any array");
      }

      // Now, imageIndex contains the index of the image, and imageLocation indicates the array where it's located

      if (imageIndex !== -1) {
        switch (imageLocation) {
          case "images":
            vehicle.images[imageIndex].url = Vehicleavatar;
            vehicle.images[imageIndex].publicId = VehicleavatarId;
            break;

          case "damageImage":
            vehicle.damageImage[imageIndex].url = Vehicleavatar;
            vehicle.damageImage[imageIndex].publicId = VehicleavatarId;
            break;

          case "cardocuments":
            vehicle.cardocuments[imageIndex].url = Vehicleavatar;
            vehicle.cardocuments[imageIndex].publicId = VehicleavatarId;
            break;

          default:
            throw new Error("Invalid image location");
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
