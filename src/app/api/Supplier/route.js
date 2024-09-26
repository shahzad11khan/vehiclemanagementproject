import { connect } from "@config/db.js";
import Supplier from "@models/Supplier/Supplier.Model.js";
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
  const existingSupplier = await Supplier.findOne({ name });
  if (existingSupplier) {
    return NextResponse.json({
      error: "Supplier with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newSupplier = new Supplier({
    name,
    description,
    isActive,
  });

  console.log(newSupplier);

  const savedSupplier = await newSupplier.save();
  if (!savedSupplier) {
    return NextResponse.json({
      message: "Supplier not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "Supplier  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allSupplier = await Supplier.find();
  const SupplierCount = await Supplier.countDocuments();
  if (!allSupplier || allSupplier.length === 0) {
    return NextResponse.json({ Result: allSignature });
  } else {
    return NextResponse.json({
      result: allSignature,
      count: SupplierCount,
    });
  }
});
