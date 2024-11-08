import { connect } from "@config/db.js";
import VehicleRepair from "@models/VehicleRepair/VehicleRepair.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";

export async function POST(request) {
  try {
    await connect(); // Connect to the database

    const formData = await request.formData(); // Get the FormData object
    console.log(formData);
    // Extract fields from FormData
    const issues = formData.get("issues");
    const vehicleName = formData.get("vehicleName");
    const registrationNumber = formData.get("registrationNumber");
    const adminCreatedBy = formData.get("adminCreatedBy");
    const adminCompanyName = formData.get("adminCompanyName");
    const adminCompanyId = formData.get("adminCompanyId");
    const organisation = formData.get("repairHistory[0][organisation]");
    const repairStatus = formData.get("repairHistory[0][repairStatus]");
    const jobNumber = formData.get("repairHistory[0][jobNumber]");
    const memo = formData.get("repairHistory[0][memo]");
    const labourHours = formData.get("repairHistory[0][labourHours]");
    const cost = formData.get("repairHistory[0][cost]");
    const signedOffBy = formData.get("repairHistory[0][signedOffBy]");
    const date = formData.get("repairHistory[0][date]");

    // Handle images
    const imageFiles = {};
    const repairHistor = [];
    for (const [key, value] of formData.entries()) {
      // console.log(key, value);

      if (key.startsWith("repairHistory[0][images]")) {
        imageFiles[key] = value;
      } else if (key.startsWith("repairHistory[0][parts]")) {
        repairHistor[key] = value;
        // console.log("repair history ", key, value);
      }
    }

    // console.log("console agian : ", repairHistor);
    const repairHistory = [];
    const parts = [];
    for (const [key, value] of Object.entries(repairHistor)) {
      const match = key.match(
        /repairHistory\[\d+\]\[parts\]\[(\d+)\]\[(\w+)\]/
      );
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];

        // Ensure parts array has enough space
        if (!parts[index]) parts[index] = {};

        // Assign the value to the correct field
        parts[index][field] = value;
      }
    }
    console.log(parts);
    repairHistory.push({ parts });

    const uploadedImages = [];
    for (const imageFile of Object.entries(imageFiles)) {
      const imageBuffer = await imageFile.arrayBuffer();
      const uploadedImage = await cloudinary.uploader
        .upload_stream({ folder: "vehicle_repairs/" }, (error, result) => {
          if (error) {
            throw new Error("Cloudinary upload failed");
          }
          return result;
        })
        .end(Buffer.from(imageBuffer));

      uploadedImages.push({
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      });
    }
    // Create the vehicle repair record with images
    const newVehicleRepair = new VehicleRepair({
      issues,
      vehicleName,
      organisation,
      repairStatus,
      memo,
      registrationNumber,
      jobNumber,
      labourHours,
      cost,
      repairHistory,
      signedOffBy,
      date,
      adminCreatedBy,
      adminCompanyName,
      adminCompanyId,
      images: uploadedImages, // Store Cloudinary image URLs and public_ids
    });

    await newVehicleRepair.save();

    return NextResponse.json(
      {
        message: "Vehicle repair created successfully",
        vehicleRepair: newVehicleRepair,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating vehicle repair record", error },
      { status: 500 }
    );
  }
}

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allVehiclVehicleRepaire = await VehicleRepair.find();
  const VehicleCountVehicleRepair = await VehicleRepair.countDocuments();
  if (!allVehiclVehicleRepaire || allVehiclVehicleRepaire.length === 0) {
    return NextResponse.json({ result: allVehiclVehicleRepaire });
  } else {
    return NextResponse.json({
      result: allVehiclVehicleRepaire,
      count: VehicleCountVehicleRepair,
    });
  }
});
