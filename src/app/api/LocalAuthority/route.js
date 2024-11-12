import { connect } from "@config/db.js";
import LocalAuthority from "@models/LocalAuthority/LocalAuthority.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name
  const existingVehicle = await LocalAuthority.findOne({
    name: name,
    adminCompanyName: adminCompanyName,
  });
  if (existingVehicle) {
    return NextResponse.json({
      error: "LocalAuthority with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newLocalAuthority = new LocalAuthority({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newLocalAuthority);

  const savedLocalAuthority = await newLocalAuthority.save();
  if (!savedLocalAuthority) {
    return NextResponse.json({
      message: "LocalAuthority not added",
      status: 400,
    });
  } else {
    return NextResponse.json({
      message: "LocalAuthority  created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allLocalAuthority = await LocalAuthority.find().sort({ createdAt: -1 });
  const LocalAuthorityCount = await LocalAuthority.countDocuments();
  if (!allLocalAuthority || allLocalAuthority.length === 0) {
    return NextResponse.json({ Result: allLocalAuthority });
  } else {
    return NextResponse.json({
      Result: allLocalAuthority,
      count: LocalAuthorityCount,
    });
  }
});
