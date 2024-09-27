import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connect();

    // Parse JSON data from the request body
    const formDataObject = await request.json();

    // Destructure the properties from the parsed JSON
    const {
      manufacturer,
      model,
      year,
      type,
      engineType,
      fuelType,
      transmission,
      drivetrain,
      exteriorColor,
      interiorColor,
      dimensionsHeight,
      dimensionsWidth,
      dimensionsLength,
      passengerCapacity,
      cargoCapacity,
      horsepower,
      torque,
      topSpeed,
      towingCapacity,
      fuelEfficiency,
      safetyFeatures,
      techFeatures,
      price,
      registrationNumber,
      warrantyInfo,
      isActive
    } = formDataObject;

    // Check for existing vehicle by registration number
    const existingVehicle = await Vehicle.findOne({ registrationNumber });
    if (existingVehicle) {
      return NextResponse.json({
        error: "Vehicle with this registration number already exists",
        status: 400,
      });
    }

    // Create and save the new vehicle entry
    const newVehicle = new Vehicle({
      manufacturer,
      model,
      year,
      type,
      engineType,
      fuelType,
      transmission,
      drivetrain,
      exteriorColor,
      interiorColor,
      dimensions: {
        height: dimensionsHeight,
        width: dimensionsWidth,
        length: dimensionsLength,
      },
      passengerCapacity,
      cargoCapacity,
      horsepower,
      torque,
      topSpeed,
      towingCapacity,
      fuelEfficiency,
      safetyFeatures,
      techFeatures,
      price,
      registrationNumber,
      warrantyInfo,
      isActive,
    });

    console.log(newVehicle);

    const savedVehicle = await newVehicle.save();
    if (!savedVehicle) {
      return NextResponse.json({ message: "Vehicle not added", status: 400 });
    } else {
      return NextResponse.json({
        message: "Vehicle created successfully",
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: error.message, status: 500 });
  }
}

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allVehicle = await Vehicle.find();
  const VehicleCount = await Vehicle.countDocuments();
  if (!allVehicle || allVehicle.length === 0) {
    return NextResponse.json({ result: allVehicle });
  } else {
    return NextResponse.json({ result: allVehicle, count: VehicleCount });
  }
});
