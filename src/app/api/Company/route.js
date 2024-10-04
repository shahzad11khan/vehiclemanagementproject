import { connect } from "@config/db.js";
import Company from "@models/Company/Company.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connect();
    const data = await request.formData();

    console.log(data);

    // Handling the uploaded files
    let file1 = data.get("image");
    console.log("image:", file1);

    let image = "";
    let imagePublicId = "";

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
                reject(new Error("Error uploading image: " + error.message));
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer1);
      });

      image = uploadResponse1.secure_url; // Cloudinary URL for display image
      imagePublicId = uploadResponse1.public_id;
    }

    // Constructing formDataObject excluding the files

    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      if (key !== "image") {
        formDataObject[key] = value;
      }
    }
    // Only hash the password if it's being updated

    const {
      CompanyName,
      email,
      password,
      confirmPassword,
      isActive,
      CreatedBy,
      CompanyRegistrationNumber,
      vatnumber,
    } = formDataObject;

    // let hashedPassword = null;
    // if (password) {
    //   hashedPassword = await bcrypt.hash(password, 10);
    // }
    // console.log(hashedPassword);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const existingUser = await Company.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        error: "Company Already Exist",
        status: 400,
      });
    }

    // Create and save the new blog entry
    const newCompany = new Company({
      CompanyName,
      email,
      password: hashedPassword,
      confirmPassword,
      isActive,
      CreatedBy,
      image,
      imagePublicId,
      CompanyRegistrationNumber,
      vatnumber,
      isActive: isActive || false,
    });

    console.log(newCompany);

    // return;

    const savedFirm = await newCompany.save();
    if (!savedFirm) {
      return NextResponse.json({ message: "Company not added", status: 400 });
    } else {
      return NextResponse.json({
        message: "Company created successfully",
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
  const allCompany = await Company.find();
  const CompanyCount = await Company.countDocuments();
  if (!allCompany || allCompany.length === 0) {
    return NextResponse.json({ result: allCompany });
  } else {
    return NextResponse.json({ result: allCompany, count: CompanyCount });
  }
});
