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

    console.log(data);

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
    console.log(image);

    let imagePublicId = company.imagePublicId; // Retain existing public ID by default
    console.log(imagePublicId);
    // Check if the user avatar is an object and has a valid name (indicating it's a file)

    if (file1 && typeof file1 === "object" && file1.name) {
      const byteData = await file1.arrayBuffer();
      const buffer = Buffer.from(byteData);

      // Upload the new image to Cloudinary
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

        // Write buffer to the upload stream
        uploadStream.end(buffer);
      });

      image = uploadResponse.secure_url;
      imagePublicId = uploadResponse.public_id;
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
      userId,
      password,
      confirmPassword,
      isActive,
      CreatedBy,
      CompanyRegistrationNumber,
      vatnumber,
      mailingAddress,
      physical_Address,
      phoneNumber,
      fax_Number,
      generalEmail,
      accountsPayableEmail,
      specificContactEmail,
      accountsPayableContactName,
      accountsPayableContactPhoneNumberandEmail,
      billingAddress,
      paymentTermsAgreedPaymentSchedule,
      paymentTermsPreferredPaymentMethod,
      bankingInformationBankName,
      bankingInformationBankAccountNumber,
      bankingInformationBankIBANSWIFTCode,
      bankingInformationBankAddress,
      specificDepartmentContactInformationBillingFinanceDepartment,
      specificDepartmentContactInformationProcurementPurchasingContact,
      specificDepartmentContactInformationPrimaryContactfortheProject,
      Postcode,
      BuildingAndStreetOne,
      BuildingAndStreetTwo,
      Town_City,
      Country,
    } = formDataObject;
    //
    company.Postcode = Postcode || company.Postcode;
    company.BuildingAndStreetOne = BuildingAndStreetOne || company.BuildingAndStreetOne;
    company.BuildingAndStreetTwo = BuildingAndStreetTwo || company.BuildingAndStreetTwo;
    company.Town_City = Town_City || company.Town_City;
    company.Country = Country || company.Country;
    company.mailingAddress = mailingAddress || company.mailingAddress;
    company.userId = userId || company.userId;
    company.physical_Address = physical_Address || company.physical_Address;
    company.phoneNumber = phoneNumber || company.phoneNumber;
    company.fax_Number = fax_Number || company.fax_Number;
    company.generalEmail = generalEmail || company.generalEmail;
    company.accountsPayableEmail =
      accountsPayableEmail || company.accountsPayableEmail;
    company.specificContactEmail =
      specificContactEmail || company.specificContactEmail;
    company.accountsPayableContactName =
      accountsPayableContactName || company.accountsPayableContactName;
    company.accountsPayableContactPhoneNumberandEmail =
      accountsPayableContactPhoneNumberandEmail ||
      company.accountsPayableContactPhoneNumberandEmail;
    company.billingAddress = billingAddress || company.billingAddress;
    company.paymentTermsAgreedPaymentSchedule =
      paymentTermsAgreedPaymentSchedule ||
      company.paymentTermsAgreedPaymentSchedule;
    company.paymentTermsPreferredPaymentMethod =
      paymentTermsPreferredPaymentMethod ||
      company.paymentTermsPreferredPaymentMethod;
    company.bankingInformationBankName =
      bankingInformationBankName || company.bankingInformationBankName;
    company.bankingInformationBankAccountNumber =
      bankingInformationBankAccountNumber ||
      company.bankingInformationBankAccountNumber;
    company.bankingInformationBankIBANSWIFTCode =
      bankingInformationBankIBANSWIFTCode ||
      company.bankingInformationBankIBANSWIFTCode;
    company.bankingInformationBankAddress =
      bankingInformationBankAddress || company.bankingInformationBankAddress;
    company.specificDepartmentContactInformationBillingFinanceDepartment =
      specificDepartmentContactInformationBillingFinanceDepartment ||
      company.specificDepartmentContactInformationBillingFinanceDepartment;
    company.specificDepartmentContactInformationProcurementPurchasingContact =
      specificDepartmentContactInformationProcurementPurchasingContact ||
      company.specificDepartmentContactInformationProcurementPurchasingContact;
    company.specificDepartmentContactInformationPrimaryContactfortheProject =
      specificDepartmentContactInformationPrimaryContactfortheProject ||
      company.specificDepartmentContactInformationPrimaryContactfortheProject;
    //
    // Update the company details
    company.CompanyName = CompanyName || company.CompanyName;
    company.CompanyRegistrationNumber =
      CompanyRegistrationNumber || company.CompanyRegistrationNumber;
    company.vatnumber = vatnumber || company.vatnumber;
    company.email = email || company.email;

    // Only hash the password if it's being updated
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      company.password = hashedPassword || company.password;
    }

    company.isActive = isActive ? isActive : company.isActive;
    company.CreatedBy = CreatedBy || company.CreatedBy;
    company.CompanyName = CompanyName || company.CompanyName;
    company.confirmPassword = confirmPassword || company.confirmPassword;
    company.image = image || company.image; // Update the image URL
    company.imagePublicId = imagePublicId || company.imagePublicId; // Update the public ID

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
