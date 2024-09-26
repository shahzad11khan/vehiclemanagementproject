import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connect(); // Connect to the database

    const id = params.VehicleID;
    const data = await request.formData();

    const formDataObject = {};
    for (const [key, value] of data.entries()) {
      formDataObject[key] = value;
    }

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
      dimensions,
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
    } = formDataObject;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found", status: 404 });
    }

    // Update vehicle properties with values from formDataObject or retain existing values
    vehicle.manufacturer = manufacturer || vehicle.manufacturer;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.type = type || vehicle.type;
    vehicle.engineType = engineType || vehicle.engineType;
    vehicle.fuelType = fuelType || vehicle.fuelType;
    vehicle.transmission = transmission || vehicle.transmission;
    vehicle.drivetrain = drivetrain || vehicle.drivetrain;
    vehicle.exteriorColor = exteriorColor || vehicle.exteriorColor;
    vehicle.interiorColor = interiorColor || vehicle.interiorColor;

    vehicle.dimensions = {
      height: dimensions.height || vehicle.dimensions?.height,
      width: dimensions.width || vehicle.dimensions?.width,
      length: dimensions.length || vehicle.dimensions?.length,
    };

    vehicle.passengerCapacity = passengerCapacity || vehicle.passengerCapacity;
    vehicle.cargoCapacity = cargoCapacity || vehicle.cargoCapacity;
    vehicle.horsepower = horsepower || vehicle.horsepower;
    vehicle.torque = torque || vehicle.torque;
    vehicle.topSpeed = topSpeed || vehicle.topSpeed;
    vehicle.towingCapacity = towingCapacity || vehicle.towingCapacity;
    vehicle.fuelEfficiency = fuelEfficiency || vehicle.fuelEfficiency;
    vehicle.safetyFeatures = safetyFeatures || vehicle.safetyFeatures;
    vehicle.techFeatures = techFeatures || vehicle.techFeatures;
    vehicle.price = price || vehicle.price;
    vehicle.registrationNumber =
      registrationNumber || vehicle.registrationNumber;
    vehicle.warrantyInfo = warrantyInfo || vehicle.warrantyInfo;

    await vehicle.save();

    return NextResponse.json({
      message: "Vehicle details updated successfully",
      vehicle,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating vehicle details:", error);
    return NextResponse.json({
      error: "Failed to update vehicle details",
      status: 500,
    });
  }
}

// GET handler for retrieving a specific driver by ID
export const GET = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  // Extract the Driver ID from the request parameters
  const id = params.VehicleID;
  console.log(id);

  // Find the driver by ID
  const Find_Vehicle = await Driver.findById(id);

  // Check if the driver exists
  if (!Find_Vehicle) {
    return NextResponse.json({ result: "No Vehicle Found", status: 404 });
  }

  // Return the found driver as a JSON response
  return NextResponse.json({ result: Find_Vehicle, status: 200 });
});

// DELETE handler for deleting a driver and associated image
export const DELETE = catchAsyncErrors(async (request, { params }) => {
  // Connect to the database
  await connect();

  const id = params.VehicleID;
  console.log("Driver ID:", id);
  const deletedVehicle = await Vehicle.findOneAndDelete({
    id,
  });
  if (!deletedVehicle) {
    return NextResponse.json({
      error: "Vehicle not found",
      status: 404,
    });
  }
  return NextResponse.json({
    message: "Vehicle deleted successfully",
    success: true,
    status: 200,
  });
});
