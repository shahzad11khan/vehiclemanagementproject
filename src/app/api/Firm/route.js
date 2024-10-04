import { connect } from "@config/db.js";
import { Firm } from "@models/Firm/Firm.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function POST(request) {
  try {
    await connect();
    const data = await request.formData();
    console.log(data);

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
      companyNo,
      vatNo,
      insurancePolicyNo,
      website,
      email,
      tel1,
      tel2,
      address,
      city,
      country,
      postcode,
      employmentLetter,
      coverLetter,
      signature,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      // imageNote,
    } = formDataObject;

    console.log(formDataObject);

    const existingUser = await Firm.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        error: "Firm Already Exist",
        status: 400,
      });
    }

    // Create and save the new blog entry
    const newFirm = new Firm({
      name,
      description,
      imageName,
      companyNo,
      vatNo,
      insurancePolicyNo,
      website,
      email,
      tel1,
      tel2,
      address,
      city,
      country,
      postcode,
      employmentLetter,
      coverLetter,
      signature,
      imageFile,
      imagepublicId,
      adminCreatedBy,
      adminCompanyName,
      // imageNote,
      isActive: isActive || false,
    });

    console.log(newFirm);

    // return;

    const savedFirm = await newFirm.save();
    if (!savedFirm) {
      return NextResponse.json({ message: "Firm not added", status: 400 });
    } else {
      return NextResponse.json({
        message: "Firm created successfully",
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
  const allFirm = await Firm.find();
  const FirmCount = await Firm.countDocuments();
  if (!allFirm || allFirm.length === 0) {
    return NextResponse.json({ result: allFirm });
  } else {
    return NextResponse.json({ result: allFirm, count: FirmCount });
  }
});
