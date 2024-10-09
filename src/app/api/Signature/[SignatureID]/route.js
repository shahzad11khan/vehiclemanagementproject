import { connect } from "@config/db.js";
import Signature from "@models/Signature/Signature.Model.js";
import cloudinary from "@middlewares/cloudinary.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  await connect();
  const id = context.params.SignatureID; // Ensure this parameter matches your routing setup
  const data = await request.formData();

  console.log(data);

  // Get existing signature by ID
  const existingSignature = await Signature.findById({ _id: id }); // Use findById to find by ID
  if (!existingSignature) {
    return NextResponse.json({
      error: "Signature not found",
      status: 404,
    });
  }

  // Handle image file upload if present
  let file1 = data.get("imageFile");
  let imageFile = existingSignature.imageFile;
  let imagepublicId = existingSignature.imagepublicId;

  if (file1 && typeof file1 === "object" && file1.name) {
    const buffer1 = Buffer.from(await file1.arrayBuffer());
    // Delete the old image from Cloudinary if a new image is uploaded
    if (imagepublicId) {
      await cloudinary.uploader.destroy(imagepublicId, {
        resource_type: "auto",
      });
    }

    // Upload new image to Cloudinary
    const uploadResponse1 = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(new Error("Error uploading image: " + error.message));
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer1);
    });

    imageFile = uploadResponse1.secure_url;
    imagepublicId = uploadResponse1.public_id;
  }

  // Constructing the updated data
  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    if (key !== "imageFile") {
      formDataObject[key] = value;
    }
  }

  const {
    name,
    description,
    imageName,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  } = formDataObject;

  // Update the existing signature
  existingSignature.name = name || existingSignature.name;
  existingSignature.description = description || existingSignature.description;
  existingSignature.imageName = imageName || existingSignature.imageName;
  existingSignature.imageFile = imageFile; // Update imageFile
  existingSignature.imagepublicId = imagepublicId; // Update imagepublicId
  existingSignature.isActive =
    isActive !== undefined ? isActive : existingSignature.isActive; // Check for undefined to allow false
  existingSignature.adminCreatedBy =
    adminCreatedBy || existingSignature.adminCreatedBy;
  existingSignature.adminCompanyName =
    adminCompanyName || existingSignature.adminCompanyName;

  const updatedSignature = await existingSignature.save();

  return NextResponse.json({
    message: "Signature updated successfully",
    success: true,
    status: 200,
    data: updatedSignature,
  });
};

// GET handler for retrieving a specific signature by ID
export const GET = async (request, context) => {
  try {
    // Connect to the database
    await connect();

    // Extract the Signature ID from the request parameters
    const { SignatureID } = context.params; // Correctly destructuring SignatureID from context.params
    console.log("Signature ID:", SignatureID);

    // Find the signature by ID
    const foundSignature = await Signature.findById(SignatureID);

    // Check if the signature exists
    if (!foundSignature) {
      return NextResponse.json({ result: "No Signature Found", status: 404 });
    }

    // Return the found signature as a JSON response
    return NextResponse.json({ result: foundSignature, status: 200 });
  } catch (error) {
    console.error("Error fetching signature:", error); // Log the error for debugging
    return NextResponse.json({ error: "Internal Server Error", status: 500 }); // Return an error response
  }
};

// delete
export const DELETE = async (request, context) => {
  try {
    await connect();

    // Extract the Signature ID from the request parameters
    const { SignatureID } = context.params; // Correctly destructuring SignatureID from context.params
    console.log("Signature ID:", SignatureID);

    // Find the signature by ID
    const signature = await Signature.findById(SignatureID);
    if (!signature) {
      return NextResponse.json({
        error: "Signature not found",
        status: 404,
      });
    }

    // Remove the image from Cloudinary
    if (signature.imagepublicId) {
      await cloudinary.uploader.destroy(signature.imagepublicId, {
        resource_type: "auto",
      });
    }

    // Delete the signature entry from the database
    await Signature.findByIdAndDelete(SignatureID); // Use SignatureID directly

    return NextResponse.json({
      message: "Signature deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting signature:", error); // Log the error for debugging
    return NextResponse.json({ error: "Internal Server Error", status: 500 }); // Return an error response
  }
};
