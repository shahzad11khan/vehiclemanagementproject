import { connect } from "@config/db.js";
import Signature from "@models/Signature/Signature.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import cloudinary from "@middlewares/cloudinary.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connect();
    const data = await request.formData();

    // Handling the uploaded files
    let file1 = data.get("imageFile");
    console.log("Image:", file1);

    let imageFile = "";
    let imagepublicId = "";

    // Upload files to Cloudinary
    if (file1) {
      const buffer1 = Buffer.from(await file1.arrayBuffer());
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

      imageFile = uploadResponse1.secure_url; // Cloudinary URL for display image
      imagepublicId = uploadResponse1.public_id;
    }

    // Constructing formDataObject excluding the files
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

    console.log(formDataObject);

    const existingUser = await Signature.findOne({
  $and: [{ name: name }, { adminCompanyName: adminCompanyName }],
});
    if (existingUser) {
      return NextResponse.json({
        error: "Signature Already Exist",
        status: 400,
      });
    }

    // Create and save the new blog entry
    const newSignature = new Signature({
      name,
      description,
      imageName,
      imagepublicId,
      imageFile,
      adminCreatedBy,
      adminCompanyName,
      isActive: isActive || false,
    });

    console.log(newSignature);

    // return;

    const savedSignature = await newSignature.save();
    if (!savedSignature) {
      return NextResponse.json({ message: "Signature not added", status: 400 });
    } else {
      return NextResponse.json({
        message: "Signature created successfully",
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allSignature = await Signature.find().sort({ createdAt: -1 });
  const SignatureCount = await Signature.countDocuments();
  if (!allSignature || allSignature.length === 0) {
    return NextResponse.json({ Result: allSignature });
  } else {
    return NextResponse.json({
      Result: allSignature,
      count: SignatureCount,
    });
  }
});
