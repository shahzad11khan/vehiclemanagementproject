import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function POST(request) {
  try {
    await connect(); // Ensure database connection

    const formData = await request.formData();
    const formDataObject = Object.fromEntries(formData); // Convert form data to an object

    console.log(formDataObject);

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
      LocalAuthority,
    } = formDataObject;

    // Validate required fields
    if (!registrationNumber || !manufacturer || !model) {
      return NextResponse.json({
        error: "Registration number, manufacturer, and model are required",
        status: 400,
      });
    }

    // Check if the vehicle already exists
    const existingVehicle = await Vehicle.findOne({ registrationNumber });
    if (existingVehicle) {
      return NextResponse.json({
        error: "Vehicle with this registration number already exists",
        status: 400,
      });
    }

    // Handle image uploads or assign a dummy image
    const imageFile = formData.get("imageFile");
    let imageUrl = "";
    let imageId = "";

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      try {
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) {
                reject(new Error("Error uploading image: " + error.message));
              } else {
                resolve(result);
              }
            })
            .end(buffer);
        });

        imageUrl = uploadResponse.secure_url; // Cloudinary URL for the image
        imageId = uploadResponse.public_id; // Cloudinary public ID for future reference
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({
          error: "Failed to upload image",
          status: 500,
        });
      }
    } else {
      // Use a default image if no image is uploaded
      imageUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpshsQpl4Ifd7LXyD4Z9Tqt1p0tBlZOsyzeg&s";
      imageId = "123435456766";
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
      LocalAuthority,
      imageFile: imageUrl, // Store Cloudinary URL
      imagePublicId: imageId, // Store Cloudinary public ID
    });

    const savedVehicle = await newVehicle.save();

    return NextResponse.json({
      message: "Vehicle created successfully",
      success: true,
      vehicle: savedVehicle,
      status: 201,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({
      error: error.message || "Internal Server Error",
      status: 500,
    });
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
