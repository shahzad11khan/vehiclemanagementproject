import { connect } from "@config/db.js";
import CarModel from "@models/CarModel/Car.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name,makemodel, description, isActive, adminCreatedBy, adminCompanyName,companyId } =
    data; // Extract the new variables

  // Check for existing vehicle by name// Check for existing CarModel by name and adminCompanyName
  const existingCarModel = await CarModel.findOne({
  $and: [{ name: name },{ makemodel: makemodel} ,{ adminCompanyName: adminCompanyName }],
});
  if (existingCarModel) {
    return NextResponse.json({
      error: "CarModel with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newCarModel = new CarModel({
    name,
    makemodel,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
    companyId
  });

  console.log(newCarModel);

  const savedCarModel = await newCarModel.save();
  if (!savedCarModel) {
    return NextResponse.json({ message: "CarModel not added", status: 400 });
  } else {
    return NextResponse.json({
      message: "CarModel created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allCarModel = await CarModel.find().sort({ createdAt: -1 }).populate("companyId");
  const CarModelCount = await CarModel.countDocuments();
  if (!allCarModel || allCarModel.length === 0) {
    return NextResponse.json({ result: allCarModel });
  } else {
    return NextResponse.json({ result: allCarModel, count: CarModelCount });
  }
});
