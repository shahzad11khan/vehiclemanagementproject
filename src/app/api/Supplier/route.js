import { connect } from "@config/db.js";
import Supplier from "@models/Supplier/Supplier.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingSupplier = await Supplier.findOne({
  $and: [{ name: name }, { adminCompanyName: adminCompanyName }],
});
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
    adminCreatedBy,
    adminCompanyName,
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
  const allSupplier = await Supplier.find().sort({ createdAt: -1 });
  const SupplierCount = await Supplier.countDocuments();
  if (!allSupplier || allSupplier.length === 0) {
    return NextResponse.json({ Result: allSupplier });
  } else {
    return NextResponse.json({
      Result: allSupplier,
      count: SupplierCount,
    });
  }
});
