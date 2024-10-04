import { connect } from "@config/db.js";
import Enquiry from "@models/Enquiry/Enquiry.Model";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  console.log(data);

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
    adminCreatedBy,
    adminCompanyName,
  } = data; // Extract the new variables

  console.log(data);

  // Check for existing enquiry by email
  const existingEnquiry = await Enquiry.findOne({ email });
  if (existingEnquiry) {
    return NextResponse.json({
      error: "Enquiry with this email already exists",
      status: 400,
    });
  }

  // Create and save the new enquiry entry
  const newEnquiry = new Enquiry({
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
    adminCreatedBy,
    adminCompanyName,
    adminCreatedBy,
  });

  const savedEnquiry = await newEnquiry.save();
  if (!savedEnquiry) {
    return NextResponse.json({
      message: "Enquiry not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "Enquiry created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allEnquiry = await Enquiry.find();
  const EnquiryCount = await Enquiry.countDocuments();
  if (!allEnquiry || allEnquiry.length === 0) {
    return NextResponse.json({ Result: allEnquiry });
  } else {
    return NextResponse.json({ Result: allEnquiry, count: EnquiryCount });
  }
});
