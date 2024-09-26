import { connect } from "../../../../config/db.js";
import Badge from "../../../../models/Badge/Badge.Model.js";
import { catchAsyncErrors } from "../../../../middlewares/catchAsyncErrors.js";
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
  const existingBadge = await Badge.findOne({ name });
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
    return NextResponse.json({ Result: allBadge });
  } else {
    return NextResponse.json({ result: allBadge, count: BadgeCount });
  }
});
