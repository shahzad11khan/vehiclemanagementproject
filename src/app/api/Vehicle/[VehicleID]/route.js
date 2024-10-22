import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.VehicleID;
    const data = await request.formData();

    const formDataObject = Object.fromEntries(data); // Convert form data to object
    let Driveravatar = "";
    let DriveravatarId = "";

    console.log(id); // Log the ID to confirm it's being received

    const vehicle = await Vehicle.findById(id); // Fetch vehicle by ID directly
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found", status: 404 });
    }

    // Handle image upload if a new file is provided
    const imageFile = data.get("imageFile"); // Get imageFile from formData

    if (imageFile && imageFile.size > 0) {
      // If an image file is provided, upload to Cloudinary
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(new Error("Error uploading image: " + error.message));
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      });

      // Update Cloudinary image URL and public ID
      Driveravatar = uploadResponse.secure_url;
      DriveravatarId = uploadResponse.public_id;

      // Optionally: Delete the old image from Cloudinary
      if (vehicle.imagePublicId) {
        await cloudinary.uploader.destroy(vehicle.imagePublicId);
      }
    } else {
      // Keep existing image if no new file is uploaded
      Driveravatar = vehicle.imageFile;
      DriveravatarId = vehicle.imagePublicId;
    }

    // Update vehicle properties only if they exist in formDataObject
    if (formDataObject.manufacturer !== undefined)
      vehicle.manufacturer = formDataObject.manufacturer;
    if (formDataObject.model !== undefined)
      vehicle.model = formDataObject.model;
    if (formDataObject.year !== undefined) vehicle.year = formDataObject.year;
    if (formDataObject.vehicleStatus !== undefined)
      vehicle.vehicleStatus = formDataObject.vehicleStatus;
    if (formDataObject.type !== undefined) vehicle.type = formDataObject.type;
    if (formDataObject.engineType !== undefined)
      vehicle.engineType = formDataObject.engineType;
    if (formDataObject.fuelType !== undefined)
      vehicle.fuelType = formDataObject.fuelType;
    if (formDataObject.transmission !== undefined)
      vehicle.transmission = formDataObject.transmission;
    if (formDataObject.drivetrain !== undefined)
      vehicle.drivetrain = formDataObject.drivetrain;
    if (formDataObject.exteriorColor !== undefined)
      vehicle.exteriorColor = formDataObject.exteriorColor;
    if (formDataObject.interiorColor !== undefined)
      vehicle.interiorColor = formDataObject.interiorColor;

    // Update dimensions only if provided in formDataObject
    if (formDataObject.dimensions) {
      vehicle.dimensions = {
        height: formDataObject.dimensions.height || vehicle.dimensions?.height,
        width: formDataObject.dimensions.width || vehicle.dimensions?.width,
        length: formDataObject.dimensions.length || vehicle.dimensions?.length,
      };
    }

    if (formDataObject.passengerCapacity !== undefined)
      vehicle.passengerCapacity = formDataObject.passengerCapacity;
    if (formDataObject.cargoCapacity !== undefined)
      vehicle.cargoCapacity = formDataObject.cargoCapacity;
    if (formDataObject.horsepower !== undefined)
      vehicle.horsepower = formDataObject.horsepower;
    if (formDataObject.torque !== undefined)
      vehicle.torque = formDataObject.torque;
    if (formDataObject.topSpeed !== undefined)
      vehicle.topSpeed = formDataObject.topSpeed;
    if (formDataObject.towingCapacity !== undefined)
      vehicle.towingCapacity = formDataObject.towingCapacity;
    if (formDataObject.fuelEfficiency !== undefined)
      vehicle.fuelEfficiency = formDataObject.fuelEfficiency;
    if (formDataObject.safetyFeatures !== undefined)
      vehicle.safetyFeatures = formDataObject.safetyFeatures;
    if (formDataObject.techFeatures !== undefined)
      vehicle.techFeatures = formDataObject.techFeatures;
    if (formDataObject.price !== undefined)
      vehicle.price = formDataObject.price;
    if (formDataObject.registrationNumber !== undefined)
      vehicle.registrationNumber = formDataObject.registrationNumber;
    if (formDataObject.warrantyInfo !== undefined)
      vehicle.warrantyInfo = formDataObject.warrantyInfo;
    if (formDataObject.isActive !== undefined)
      vehicle.isActive = formDataObject.isActive;
    if (formDataObject.adminCreatedBy !== undefined)
      vehicle.adminCreatedBy = formDataObject.adminCreatedBy;
    if (formDataObject.adminCompanyName !== undefined)
      vehicle.adminCompanyName = formDataObject.adminCompanyName;

    // Update the imageUrl and imageId in the vehicle object
    vehicle.imageFile = Driveravatar;
    vehicle.imagePublicId = DriveravatarId;

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

    console.log(Find_User);

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

    // Find and delete the vehicle by its ID
    const deletedVehicle = await Vehicle.findById({ _id: VehicleID });
    // console.log(deletedVehicle);
    if (!deletedVehicle) {
      return NextResponse.json({
        error: "Vehicle not found",
        status: 404,
      });
    }

    console.log(deletedVehicle); // For debugging
    const deleted = await Vehicle.findByIdAndDelete({ _id: VehicleID });
    console.log(deleted);

    // Get the image public ID from the deleted vehicle object
    const userPublicIdd = deletedVehicle.imagePublicId;
    console.log("Image Public ID:", userPublicIdd);

    // If the vehicle has an associated image, delete it from Cloudinary
    if (userPublicIdd) {
      try {
        const cloudinaryResponse1 = await cloudinary.uploader.destroy(
          userPublicIdd
        );

        console.log(`Cloudinary response: ${cloudinaryResponse1.result}`);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    // Return success response
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
