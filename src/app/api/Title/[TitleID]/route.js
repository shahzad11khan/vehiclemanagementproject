import { connect } from "@config/db.js";
import Title from "@models/Title/Title.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

// PUT function to update a badge by its VehicleID
export const PUT = catchAsyncErrors(async (request, { params }) => {
  await connect(); // Connect to the database

  const id = params.BadgeID; // Extract VehicleID from params
  const data = await request.formData(); // Get the form data

  const formDataObject = {};
  for (const [key, value] of data.entries()) {
    formDataObject[key] = value;
  }

  // Destructure the necessary fields
  const { name, description, isActive } = formDataObject;

  // Find the vehicle by ID
  const title = await Title.findById(id);

  if (!title) {
    return NextResponse.json({ error: "title not found", status: 404 });
  }

  // Update vehicle properties with values from formDataObject or retain existing values
  title.name = name ? name.trim() : title.name; // Update name or retain existing
  title.description = description ? description.trim() : title.description; // Update description or retain existing
  title.isActive = isActive ? isActive : title.naisActiveme;

  // Save the updated vehicle
  await title.save();

  return NextResponse.json({
    message: "title details updated successfully",
    title,
    status: 200,
  });
});

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.TitleID;
  console.log(id);

  // Find the driver by ID
  const Find_Title = await Title.findById(id);

  // Check if the driver exists
  if (!Find_Title) {
    return NextResponse.json({ result: "No Badge Found", status: 404 });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Title, status: 200 });
});

export const DELETE = catchAsyncErrors(async (request, { params }) => {
  await connect();

  const id = params.TitleID;
  console.log("Title ID:", id);
  const deletedtitle = await Title.findOneAndDelete({
    id,
  });
  if (!deletedtitle) {
    return NextResponse.json({
      message: "title not found",
      status: 404,
    });
  }

  return NextResponse.json({
    message: "titile deleted successfully",
    success: true,
    status: 200,
  });
});
