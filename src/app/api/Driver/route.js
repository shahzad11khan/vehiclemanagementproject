import { connect } from "../../../../config/db.js";
import Driver from "../../../../models/Driver/Driver.Model.js";
import cloudinary from "../../../../middlewares/cloudinary.js";
import { catchAsyncErrors } from "../../../../middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connect();
    const data = await request.formData();

    // Handling the uploaded files
    let file1 = data.get("imageUrl");
    console.log("Driver Avatar:", file1);

    let Driveravatar = "";
    let DriveravatarId = "";

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
                  new Error("Error uploading Driveravatar: " + error.message)
                );
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer1);
      });

      Driveravatar = uploadResponse1.secure_url; // Cloudinary URL for display image
      DriveravatarId = uploadResponse1.public_id;
    }

    // Constructing formDataObject excluding the files
    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      if (key !== "Driveravatar") {
        formDataObject[key] = value;
      }
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      tel1,
      tel2,
      email,
      licenseNumber,
      niNumber,
      driverNumber,
      taxiFirm,
      badgeType,
      insurance,
      startDate,
      driverRent,
      licenseExpiryDate,
      taxiBadgeDate,
      rentPaymentCycle,
      city,
      county,
      postcode,
      postalAddress,
      permanentAddress,
      isActive,
      imageName,
    } = formDataObject;

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return NextResponse.json({
        error: "Driver with this email already exists",
        status: 400,
      });
    }

    // Create and save the new blog entry
    const newDriver = new Driver({
      firstName,
      lastName,
      dateOfBirth,
      tel1,
      tel2,
      email,
      licenseNumber,
      niNumber,
      driverNumber,
      taxiFirm,
      badgeType,
      insurance,
      startDate,
      driverRent,
      licenseExpiryDate,
      taxiBadgeDate,
      rentPaymentCycle,
      city,
      county,
      postcode,
      postalAddress,
      permanentAddress,
      imageName,
      imageUrl: Driveravatar,
      imagePublicId: DriveravatarId,
      isActive: isActive || false, // Default to "Driver" if no role is specified
    });

    console.log(newDriver);

    // return;

    const savedDriver = await newDriver.save();
    if (!savedDriver) {
      return NextResponse.json({ message: "Driver not added", status: 400 });
    } else {
      return NextResponse.json({
        message: "Driver created successfully",
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
  const allDriver = await Driver.find();
  const DriverCount = await Driver.countDocuments();
  if (!allDriver || allDriver.length === 0) {
    return NextResponse.json({ Result: allDriver });
  } else {
    return NextResponse.json({ result: allDriver, count: DriverCount });
  }
});
