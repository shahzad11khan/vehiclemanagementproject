import { connect } from "@config/db.js";
import Payment from "@models/Payment/Payment.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.formData();

  // Constructing formDataObject excluding the files
  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  const { name, description, isActive } = formDataObject; // Extract the new variables

  // Check for existing vehicle by name
  const existingPayment = await Payment.findOne({ name });
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
      result: allPayment,
      count: PaymentCount,
    });
  }
});
