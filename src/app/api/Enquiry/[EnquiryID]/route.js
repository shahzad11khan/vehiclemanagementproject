import { connect } from "@config/db.js";
import Enquiry from "@models/Enquiry/Enquiry.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const PUT = async (request, context) => {
  try {
    await connect(); // Connect to the database

    const id = context.params.EnquiryID; // Extract EnquiryID from params
    const data = await request.json(); // Get the form data as JSON object

    // Find the enquiry by ID
    const enquiry = await Enquiry.findById({ _id: id });
    console.log(enquiry);

    if (!enquiry) {
      return NextResponse.json({
        error: "Enquiry not found",
        status: 404,
      });
    }

    // Update enquiry properties with values from data or retain existing values
    enquiry.firstName = data.firstName || enquiry.firstName;
    enquiry.lastName = data.lastName || enquiry.lastName;
    enquiry.email = data.email || enquiry.email;
    enquiry.tel1 = data.tel1 || enquiry.tel1;
    enquiry.tel2 = data.tel2 || enquiry.tel2;
    enquiry.postcode = data.postcode || enquiry.postcode;
    enquiry.postalAddress = data.postalAddress || enquiry.postalAddress;
    enquiry.permanentAddress =
      data.permanentAddress || enquiry.permanentAddress;
    enquiry.city = data.city || enquiry.city;
    enquiry.county = data.county || enquiry.county;
    enquiry.dateOfBirth = data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : enquiry.dateOfBirth;
    enquiry.niNumber = data.niNumber || enquiry.niNumber;
    enquiry.badgeType = data.badgeType || enquiry.badgeType;
    enquiry.localAuthority = data.localAuthority || enquiry.localAuthority;
    enquiry.isActive =
      data.isActive !== undefined ? data.isActive : enquiry.isActive; // Corrected to handle `false` as a valid value
    enquiry.adminCreatedBy = data.adminCreatedBy || enquiry.adminCreatedBy;
    enquiry.adminCompanyName =
      data.adminCompanyName || enquiry.adminCompanyName;

    // Save the updated enquiry
    await enquiry.save();

    return NextResponse.json({
      message: "Enquiry details updated successfully",
      enquiry,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json({
      error: "Failed to update enquiry",
      details: error.message,
      status: 500,
    });
  }
};

// GET handler for retrieving a specific driver by ID
// GET handler for retrieving a specific product by ID
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.EnquiryID;
    console.log(id);

    // Find the product by ID
    const Find_User = await Enquiry.findById(id);

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

export const DELETE = async (request, context) => {
  try {
    await connect();

    const id = context.params.EnquiryID; // Ensure EnquiryID is correctly passed
    console.log("Enquiry ID:", id);

    const deletedEnquiry = await Enquiry.findOneAndDelete({ _id: id });

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
  } catch (error) {
    console.error("Error deleting enquiry:", error); // Log the error for debugging
    return NextResponse.json({
      message: "An error occurred while deleting the enquiry",
      error: error.message, // Provide error details for easier debugging
      status: 500,
    });
  }
};
