import { connect } from "@config/db.js";
import Payment from "@models/Payment/Payment.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingPayment = await Payment.findOne({
    name: name,
    adminCompanyName: adminCompanyName,
  });
  if (existingPayment) {
    return NextResponse.json({
      error: "Payment with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newPayment = new Payment({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newPayment);

  const savedPayment = await newPayment.save();
  if (!savedPayment) {
    return NextResponse.json({
      message: "Payment not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "Payment  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allPayment = await Payment.find();
  const PaymentCount = await Payment.countDocuments();
  if (!allPayment || allPayment.length === 0) {
    return NextResponse.json({ Result: allPayment });
  } else {
    return NextResponse.json({
      Result: allPayment,
      count: PaymentCount,
    });
  }
});
