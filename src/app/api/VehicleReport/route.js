import { connect } from "@config/db.js";
import VehicleRepair from "@models/VehicleRepair/VehicleRepair.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";

export async function POST(request) {
  try {
    await connect(); // Connect to the database
    const formData = await request.formData(); // Get the FormData object

    // Extract general fields from FormData
    const issues = formData.get("issues");
    const vehicleName = formData.get("vehicleName");
    const registrationNumber = formData.get("registrationNumber");
    const adminCreatedBy = formData.get("adminCreatedBy");
    const adminCompanyName = formData.get("adminCompanyName");
    const adminCompanyId = formData.get("adminCompanyId");

    // Extract repair-related fields
    const organisation = formData.get("repairHistory[0][organisation]");
    const repairStatus = formData.get("repairHistory[0][repairStatus]");
    const jobNumber = formData.get("repairHistory[0][jobNumber]");
    const memo = formData.get("repairHistory[0][memo]");
    const labourHours = formData.get("repairHistory[0][labourHours]");
    const cost = formData.get("repairHistory[0][cost]");
    const signedOffBy = formData.get("repairHistory[0][signedOffBy]");
    const date = formData.get("repairHistory[0][date]");

    // const imageFiles = [];
    const images = [];
    const parts = [];

    // Separate handling of files and parts from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("repairHistory[0][images]")) {
        console.log(key, value);
        // imageFiles.push(value);
        if (value) {
          const buffer = Buffer.from(await value.arrayBuffer()); // Convert file to buffer
          // Upload to Cloudinary
          const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ resource_type: "auto" }, (error, result) => {
                if (error) {
                  reject(new Error("Error uploading image: " + error.message));
                } else {
                  resolve(result);
                }
              })
              .end(buffer); // Send buffer to Cloudinary
          });

          // Store Cloudinary response (URL and public ID)
          images.push({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
          });
        }
      }
      // Handle parts
      const partsMatch = key.match(
        /repairHistory\[0\]\[parts\]\[(\d+)\]\[(\w+)\]/
      );
      if (partsMatch) {
        const index = parseInt(partsMatch[1], 10);
        const field = partsMatch[2];

        // Ensure parts array has enough space
        if (!parts[index]) parts[index] = {};

        // Assign value to the correct part field
        parts[index][field] = value;
      }
    }

    // Prepare the repair history object
    const repairHistory = {
      parts,
    };

    console.log(images);
    // Create a new vehicle repair record
    const newVehicleRepair = new VehicleRepair({
      issues,
      vehicleName,
      registrationNumber,
      adminCreatedBy,
      adminCompanyName,
      adminCompanyId,
      organisation,
      repairStatus,
      labourHours,
      memo,
      jobNumber,
      cost,
      signedOffBy,
      date,
      repairHistory,
      images,
    });

    // Save to database
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
      { message: "Error creating vehicle repair record", error: error.message },
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
