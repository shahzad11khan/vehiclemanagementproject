import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.VehicleID;
    const formDataObject = await request.json(); // Parse JSON data from the request body

    // Destructure values from formDataObject with defaults
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
      dimensions = {}, // Default to an empty object if dimensions are not provided
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
      adminCreatedBy,
      adminCompanyName,
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

    // Update dimensions only if provided
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
    vehicle.isActive = isActive || vehicle.isActive;
    vehicle.adminCreatedBy = adminCreatedBy || vehicle.adminCreatedBy;
    vehicle.adminCompanyName = adminCompanyName || vehicle.adminCompanyName;
    vehicle.price = price || vehicle.price;
    vehicle.registrationNumber =
      registrationNumber || vehicle.registrationNumber;
    vehicle.warrantyInfo = warrantyInfo || vehicle.warrantyInfo;

    // Save the updated vehicle
    await vehicle.save();

    return NextResponse.json({
      message: "Vehicle details updated successfully",
      vehicle,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating vehicle details:", error);
    return NextResponse.json({
      error: error.message || "Failed to update vehicle details",
      status: 500,
    });
  }
}
// GET handler for retrieving a specific product by ID
export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.VehicleID;
    console.log(id);

    // Find the product by ID
    const Find_User = await Vehicle.findById(id);

    // Check if the product exists
    if (!Find_User) {
      return NextResponse.json({ result: "No User Found", status: 404 });
    } else {
      // Return the found product as a JSON response
      return NextResponse.json({ result: Find_User, status: 200 });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    // Return an error response
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}

// DELETE handler for deleting a vehicle and associated image
export const DELETE = async (request, { params }) => {
  try {
    // Connect to the database
    await connect();

    const { VehicleID } = params; // Access the VehicleID from params

    console.log("Vehicle ID:", VehicleID);

    // Find and delete the vehicle
    const deletedVehicle = await Vehicle.findOneAndDelete({ _id: VehicleID });

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
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json({
      error: "An error occurred while deleting the vehicle",
      status: 500,
    });
  }
};
