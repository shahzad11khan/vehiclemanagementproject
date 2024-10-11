import { connect } from "@config/db.js";
import Badge from "@models/Badge/Badge.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing vehicle by name// Check for existing badge by name and adminCompanyName
  const existingBadge = await Badge.findOne({
    name: name,
    adminCompanyName: adminCompanyName,
  });
  if (existingBadge) {
    return NextResponse.json({
      error: "Badge with this name already exists",
      status: 400,
    });
  }

  // Create and save the new vehicle entry
  const newBadge = new Badge({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newBadge);

  const savedBadge = await newBadge.save();
  if (!savedBadge) {
    return NextResponse.json({ message: "Badge not added", status: 400 });
  } else {
    return NextResponse.json({
      message: "Badge created successfully",
      success: true,
      status: 200,
    });
  }
});
export const GET = catchAsyncErrors(async () => {
  await connect();
  const allBadge = await Badge.find();
  const BadgeCount = await Badge.countDocuments();
  if (!allBadge || allBadge.length === 0) {
    return NextResponse.json({ result: allBadge });
  } else {
    return NextResponse.json({ result: allBadge, count: BadgeCount });
  }
});
