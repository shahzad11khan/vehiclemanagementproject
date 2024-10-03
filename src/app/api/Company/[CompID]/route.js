import { connect } from "@config/db.js";
import Company from "@models/Company/Company.Model.js";
import cloudinary from "@middlewares/cloudinary.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    await connect();
    const data = await request.formData();
    const companyId = context.params.CompID;

    console.log(companyId);

    // Extracting the company ID from the request (assumed to be in the request body)
    if (!companyId) {
      return NextResponse.json({
        error: "Company ID is required",
        status: 400,
      });
    }

    // Find the existing company by ID
    const company = await Company.findById({ _id: companyId });
    // console.log(company);

    if (!company) {
      return NextResponse.json({ error: "Company not found", status: 404 });
    }

    // Handling the uploaded files
    let file1 = data.get("image");
    console.log("image:", file1);

    let image = company.image; // Retain existing image by default
    let imagePublicId = company.imagePublicId; // Retain existing public ID by default

    // Upload files to Cloudinary if a new file is provided
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

      // Update image and public ID with the newly uploaded image
      image = uploadResponse1.secure_url;
      imagePublicId = uploadResponse1.public_id;
    }

    // Constructing formDataObject excluding the files
    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      if (key !== "image") {
        formDataObject[key] = value;
      }
    }

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

    // Update the company details
    company.CompanyName = CompanyName || company.CompanyName;
    company.CompanyRegistrationNumber =
      CompanyRegistrationNumber || company.CompanyRegistrationNumber;
    company.vatnumber = vatnumber || company.vatnumber;
    company.email = email || company.email;

    // Only hash the password if it's being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      company.password = await bcrypt.hash(password, salt);
    }

    company.isActive = isActive ? isActive : company.isActive;
    company.CreatedBy = CreatedBy || company.CreatedBy;
    company.CompanyName = CompanyName || company.CompanyName;
    company.confirmPassword = confirmPassword || company.confirmPassword;
    company.image = image; // Update the image URL
    company.imagePublicId = imagePublicId; // Update the public ID

    const updatedCompany = await company.save();
    if (!updatedCompany) {
      return NextResponse.json({ message: "Company not updated", status: 400 });
    } else {
      return NextResponse.json({
        message: "Company updated successfully",
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

// GET handler for retrieving a specific driver by ID
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.CompID;
    console.log(id);

    // Find the product by ID
    const Find_User = await Company.findById(id);

    // Check if the product exists
    if (!Find_User) {
      return NextResponse.json({ result: "No User Found", status: 404 });
    } else {
      // Return the found product as a JSON response
      return NextResponse.json({ result: Find_User, status: 200 });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    // Return an error response
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}

// DELETE handler for deleting a driver and associated image
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { CompID } = params; // Access the Driver ID from params
    console.log("Driver ID:", CompID);

    // Find the driver by ID
    const driver = await Company.findById({ _id: CompID });
    if (!driver) {
      return NextResponse.json({ message: "Driver not found", status: 404 });
    }

    // Get the image public ID from the driver object (ensure the field matches your schema)
    const imagePublicId = driver.imagePublicId;
    console.log("Image Public ID:", imagePublicId);

    // Delete the driver from the database
    const deletedDriver = await Company.findByIdAndDelete({ _id: CompID });
    if (!deletedDriver) {
      return NextResponse.json({ error: "Driver not found", status: 404 });
    }

    // If the driver has an associated image, delete it from Cloudinary
    if (imagePublicId) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.destroy(
          imagePublicId
        );
        console.log(`Cloudinary response: ${cloudinaryResponse.result}`);
        if (cloudinaryResponse.result !== "ok") {
          console.error("Failed to delete image from Cloudinary");
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return NextResponse.json({
          error: "Failed to delete image from Cloudinary",
          status: 500,
        });
      }
    }

    // Return success response
    return NextResponse.json({
      message: "Driver and associated image deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting driver:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the driver",
      status: 500,
    });
  }
};
