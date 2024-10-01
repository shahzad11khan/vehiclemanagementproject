import { connect } from "@config/db.js";
import { Firm } from "@models/Firm/Firm.Model";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = catchAsyncErrors(async (request) => {
  await connect();
  const id = params.FirmID;
  const data = await request.formData();

  // Get existing Firm by name or id
  const existingFirm = await Firm.findOne({ id });
  if (!existingFirm) {
    return NextResponse.json({
      error: "Firm not found",
      status: 404,
    });
  }

  // Handle image file upload if present
  let file1 = data.get("imageFile");
  let imageFile = existingFirm.imageFile;
  let imagepublicId = existingFirm.imagepublicId;

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
  } = formDataObject;

  // Update the existing Firm
  existingFirm.name = name || existingFirm.name;
  existingFirm.description = description || existingFirm.description;
  existingFirm.imageName = imageName || existingFirm.imageName;
  existingFirm.imagepublicId = imagepublicId || existingFirm.imagepublicId;
  existingFirm.imageFile = imageFile || existingFirm.imageFile;
  existingFirm.companyNo = companyNo || existingFirm.companyNo;
  existingFirm.vatNo = vatNo || existingFirm.vatNo;
  existingFirm.insurancePolicyNo =
    insurancePolicyNo || existingFirm.insurancePolicyNo;
  existingFirm.website = website || existingFirm.website;
  existingFirm.email = email || existingFirm.email;
  existingFirm.tel1 = tel1 || existingFirm.tel1;
  existingFirm.tel2 = tel2 || existingFirm.tel2;
  existingFirm.address = address || existingFirm.address;
  existingFirm.city = city || existingFirm.city;
  existingFirm.country = country || existingFirm.country;
  existingFirm.postcode = postcode || existingFirm.postcode;
  existingFirm.employmentLetter =
    employmentLetter || existingFirm.employmentLetter;
  existingFirm.coverLetter = coverLetter || existingFirm.coverLetter;
  existingFirm.signature = signature || existingFirm.signature;
  existingFirm.isActive = isActive || existingFirm.isActive;
  existingFirm.adminCreatedBy = adminCreatedBy || existingFirm.adminCreatedBy;
  existingFirm.adminCompanyName =
    adminCompanyName || existingFirm.adminCompanyName;

  const updatedFirm = await existingFirm.save();

  return NextResponse.json({
    message: "Firm updated successfully",
    success: true,
    status: 200,
    data: updatedFirm,
  });
});

export const DELETE = catchAsyncErrors(async (request, { params }) => {
  await connect();
  const id = params.FirmID; // Assuming you're passing the name in the request body

  const firm = await Firm.findOne({ id });
  if (!firm) {
    return NextResponse.json({
      error: "Firm not found",
      status: 404,
    });
  }

  // Remove the image from Cloudinary
  if (firm.imagepublicId) {
    await cloudinary.uploader.destroy(firm.imagepublicId, {
      resource_type: "auto",
    });
  }

  // Delete the Firm entry from the database
  await Firm.findByIdAndDelete(id);

  return NextResponse.json({
    message: "Firm deleted successfully",
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.FirmID;
  console.log(id);

  // Find the driver by ID
  const Find_Firm = await Firm.findById(id);

  // Check if the driver exists
  if (!Find_Firm) {
    return NextResponse.json({ result: "No Driver Found", status: 404 });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Firm, status: 200 });
});
