import { connect } from "@config/db.js";
import Manufecturer from "@models/Manufecturer/Manufecturer.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export const POST = catchAsyncErrors(async (request) => {
  try {
    // Connect to the database
    await connect();

    // Parse JSON data from the request body
    const data = await request.json();

    const {
      name,
      carmodel,
      description,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      companyId
    } = data; // Destructure the required fields

    // Check if a manufacturer with the same name already exists
    const existingManufacturer = await Manufecturer.findOne({
  $and: [{ name: name }, { adminCompanyName: adminCompanyName }],
});
    if (existingManufacturer) {
      return NextResponse.json({
        error: "Manufacturer with this name already exists",
        status: 400,
      });
    }

    // Create and save the new manufacturer
    const newManufacturer = new Manufecturer({
      name,
      carmodel,
      description,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      companyId
    });

    console.log(newManufacturer);

    const savedManufacturer = await newManufacturer.save();
    if (!savedManufacturer) {
      return NextResponse.json({
        message: "Manufacturer not added",
        status: 400,
      });
    }

    // Return a success response
    return NextResponse.json({
      message: "Manufacturer created successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error creating manufacturer:", error);
    return NextResponse.json({
      error: "An error occurred while creating the manufacturer",
      status: 500,
    });
  }
});

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allManufecturer = await Manufecturer.find().sort({ createdAt: -1 }).populate("companyId");
  console.log(allManufecturer)
  const ManufecturerCount = await Manufecturer.countDocuments();
  if (!allManufecturer || allManufecturer.length === 0) {
    return NextResponse.json({ Result: allManufecturer });
  } else {
    return NextResponse.json({
      Result: allManufecturer,
      count: ManufecturerCount,
    });
  }
});
