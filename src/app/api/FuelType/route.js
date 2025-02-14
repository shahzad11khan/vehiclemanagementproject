import { connect } from "@config/db.js";
import FuelType from "@models/FuelType/FuelType.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName,companyId } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingFuelType = await FuelType.findOne({
  $and: [{ name: name }, { adminCompanyName: adminCompanyName }],
});
  if (existingFuelType) {
    return NextResponse.json({
      error: "FuelType with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newFuelType = new FuelType({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
    companyId
  });


  const savedFuelType = await newFuelType.save();
  if (!savedFuelType) {
    return NextResponse.json({
      message: "FuelType not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "FuelType  created successfully",
      success: true,
      status: 200,
    });
  }
});


export const GET = async () => {
  try {
    await connect();
    const allFuelType = await FuelType.find()
      .populate("companyId")
      .sort({ createdAt: -1 });

    const FuelTypeCount = await FuelType.countDocuments();

    return NextResponse.json({
      Result: allFuelType,
      count: FuelTypeCount,
    });
  } catch (error) {
    console.error("Error fetching FuelType data:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
};
