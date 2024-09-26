import { connect } from "@config/db.js";
import Signature from "@models/Signature/Signature.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import cloudinary from "@middlewares/cloudinary.js";

export const PUT = catchAsyncErrors(async (request) => {
  await connect();
  const id = params.SignatureID;
  const data = await request.formData();

  // Get existing signature by name or id
  const existingSignature = await Signature.findOne({ id });
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

  if (file1) {
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
              reject(
                new Error("Error uploading displayImage: " + error.message)
              );
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

  const { name, description, imageName, isActive } = formDataObject;

  // Update the existing signature
  existingSignature.name = name || existingSignature.name;
  existingSignature.description = description || existingSignature.description;
  existingSignature.imageName = imageName || existingSignature.imageName;
  existingSignature.imagepublicId =
    imagepublicId || existingSignature.imagepublicId;
  existingSignature.imageFile = imageFile || existingSignature.imageFile;
  existingSignature.isActive = isActive ? isActive : existingSignature.isActive;

  const updatedSignature = await existingSignature.save();

  return NextResponse.json({
    message: "Signature updated successfully",
    success: true,
    status: 200,
    data: updatedSignature,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.SignatureID;
  console.log(id);

  // Find the driver by ID
  const Find_Signature = await Signature.findById(id);

  // Check if the driver exists
  if (!Find_Signature) {
    return NextResponse.json({ result: "No Driver Found", status: 404 });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Signature, status: 200 });
});

export const DELETE = catchAsyncErrors(async (request, { params }) => {
  await connect();
  const id = params.SignatureID; // Assuming you're passing the name in the request body

  const signature = await Signature.findOne({ id });
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
  await Signature.findByIdAndDelete({ id });

  return NextResponse.json({
    message: "Signature deleted successfully",
    status: 200,
  });
});
