import { connect } from "@config/db.js";
import Enquiry from "@models/Enquiry/Enquiry.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.EnquiryID; // Extract EnquiryID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields from formDataObject
  const {
    firstName,
    lastName,
    email,
    tel1,
    tel2,
    postcode,
    postalAddress,
    permanentAddress,
    city,
    county,
    dateOfBirth,
    niNumber,
    badgeType,
    localAuthority,
    isActive,
  } = formDataObject;

  // Find the enquiry by ID
  const enquiry = await Enquiry.findById(id);

  if (!enquiry) {
    return NextResponse.json({
      error: "Enquiry not found",
      status: 404,
    });
  }

  // Update enquiry properties with values from formDataObject or retain existing values
  enquiry.firstName = firstName ? firstName.trim() : enquiry.firstName; // Update firstName or retain existing
  enquiry.lastName = lastName ? lastName.trim() : enquiry.lastName; // Update lastName or retain existing
  enquiry.email = email ? email.trim() : enquiry.email; // Update email or retain existing
  enquiry.tel1 = tel1 ? tel1.trim() : enquiry.tel1; // Update tel1 or retain existing
  enquiry.tel2 = tel2 ? tel2.trim() : enquiry.tel2; // Update tel2 or retain existing
  enquiry.postcode = postcode ? postcode.trim() : enquiry.postcode; // Update postcode or retain existing
  enquiry.postalAddress = postalAddress
    ? postalAddress.trim()
    : enquiry.postalAddress; // Update postalAddress or retain existing
  enquiry.permanentAddress = permanentAddress
    ? permanentAddress.trim()
    : enquiry.permanentAddress; // Update permanentAddress or retain existing
  enquiry.city = city ? city.trim() : enquiry.city; // Update city or retain existing
  enquiry.county = county ? county.trim() : enquiry.county; // Update county or retain existing
  enquiry.dateOfBirth = dateOfBirth
    ? new Date(dateOfBirth)
    : enquiry.dateOfBirth; // Update dateOfBirth or retain existing
  enquiry.niNumber = niNumber ? niNumber.trim() : enquiry.niNumber; // Update niNumber or retain existing
  enquiry.badgeType = badgeType ? badgeType.trim() : enquiry.badgeType; // Update badgeType or retain existing
  enquiry.localAuthority = localAuthority
    ? localAuthority.trim()
    : enquiry.localAuthority; // Update localAuthority or retain existing
  enquiry.isActive = isActive ? isActive : enquiry.isActive; // Update isActive or retain existing

  // Save the updated enquiry
  await enquiry.save();

  return NextResponse.json({
    message: "Enquiry details updated successfully",
    enquiry,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.EnquiryID;
  console.log(id);

  // Find the driver by ID
  const Find_Enquiry = await Enquiry.findById(id);

  // Check if the driver exists
  if (!Find_Enquiry) {
    return NextResponse.json({
      result: "No Enquiry Found",
      status: 404,
    });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Enquiry, status: 200 });
});

export const DELETE = catchAsyncErrors(async (request, { params }) => {
  await connect();

  const id = params.IEnquiryID;
  console.log("Driver ID:", id);
  const deletedEnquiry = await Enquiry.findOneAndDelete({
    id,
  });
  if (!deletedEnquiry) {
    return NextResponse.json({
      message: "Enquiry not found",
      status: 404,
    });
  }

  return NextResponse.json({
    message: "Enquiry deleted successfully",
    success: true,
    status: 200,
  });
});
