import { connect } from "../../../../../config/db.js";
import Payment from "../../../../../models/Payment/Payment.Model.js";
import { catchAsyncErrors } from "../../../../../middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a Payment by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.PaymentID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive } = formDataObject;

  // Find the vehicle by ID
  const payment = await Payment.findById(id);

  if (!payment) {
    return NextResponse.json({
      error: "Payment not found",
      status: 404,
    });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  payment.name = name ? name.trim() : payment.name; // Update name or retain existing
  payment.description = description ? description.trim() : payment.description; // Update description or retain existing
  payment.isActive = isActive ? isActive : payment.isActive;

  // Save the updated vehicle
  await payment.save();

  return NextResponse.json({
    message: "Payment details updated successfully",
    Payment,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.PaymentID;
  console.log(id);

  // Find the driver by ID
  const Find_Payment = await Payment.findById(id);

  // Check if the driver exists
  if (!Find_Payment) {
    return NextResponse.json({
      result: "No Payment Found",
      status: 404,
    });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Payment, status: 200 });
});

export const DELETE = catchAsyncErrors(async (request, { params }) => {
  await connect();

  const id = params.PaymentID;
  console.log("payment ID:", id);
  const deletedPayment = await Vehicle.findOneAndDelete({
    id,
  });
  if (!deletedPayment) {
    return NextResponse.json({
      message: "Payment not found",
      status: 404,
    });
  }

  return NextResponse.json({
    message: "Payment deleted successfully",
    success: true,
    status: 200,
  });
});
