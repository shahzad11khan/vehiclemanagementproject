import { connect } from "@config/db.js";
import Title from "@models/Title/Title.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  await connect();

  // Parse the JSON data from the request body
  const data = await request.json();

  const { name, description, isActive, adminCreatedBy, adminCompanyName } =
    data; // Extract the new variables

  // Check for existing title by name
  // const existingTitle = await Title.findOne({
  //   name: name,
  //   adminCompanyName: adminCompanyName,
  // });
  // if (existingTitle) {
  //   return NextResponse.json({
  //     error: "Title with this name already exists",
  //     status: 400,
  //   });
  // }

  // Create and save the new title entry
  const newTitle = new Title({
    name,
    description,
    isActive,
    adminCreatedBy,
    adminCompanyName,
  });

  console.log(newTitle);

  const savedTitle = await newTitle.save();
  if (!savedTitle) {
    return NextResponse.json({ message: "Title not added", status: 400 });
  } else {
    return NextResponse.json({
      message: "Title created successfully",
      success: true,
      status: 200,
    });
  }
});

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allTitle = await Title.find();
  const TitleCount = await Title.countDocuments();
  if (!allTitle || allTitle.length === 0) {
    return NextResponse.json({ result: allTitle });
  } else {
    return NextResponse.json({ result: allTitle, count: TitleCount });
  }
});
