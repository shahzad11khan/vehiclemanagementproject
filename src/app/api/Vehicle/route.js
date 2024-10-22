import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

// export async function POST(request) {
//   try {
//     await connect();

//     // Parse JSON data from the request body
//     const formDataObject = await request.formData();

//     let file1 = formDataObject.get("imageFile");
//     console.log("Vehicle:", file1);

//     let Driveravatar = "";
//     let DriveravatarId = "";

//     // Upload files to Cloudinary
//     if (file1) {
//       const buffer1 = Buffer.from(await file1.arrayBuffer());
//       const uploadResponse1 = await new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ resource_type: "auto" }, (error, result) => {
//             if (error) {
//               reject(
//                 new Error("Error uploading Driveravatar: " + error.message)
//               );
//             } else {
//               resolve(result);
//             }
//           })
//           .end(buffer1);
//       });

//       Driveravatar = uploadResponse1.secure_url; // Cloudinary URL for display image
//       DriveravatarId = uploadResponse1.public_id;
//     } else {
//       Driveravatar =
//         "https://cdn-icons-png.flaticon.com/128/17561/17561717.png";
//       DriveravatarId = "123456789";
//     }

//     // Prepare object excluding imageFile
//     const formDataObjectt = {};
//     for (const [key, value] of formDataObject.entries()) {
//       if (key !== "imageFile") {
//         formDataObjectt[key] = value;
//       }
//     }

//     console.log(formDataObjectt);
//     // Destructure the properties safely
//     const {
//       manufacturer,
//       model,
//       year,
//       type,
//       engineType,
//       fuelType,
//       transmission,
//       drivetrain,
//       exteriorColor,
//       interiorColor,
//       dimensions = {}, // Provide default empty object
//       passengerCapacity,
//       cargoCapacity,
//       horsepower,
//       torque,
//       topSpeed,
//       towingCapacity,
//       fuelEfficiency,
//       safetyFeatures,
//       vehicleStatus,
//       techFeatures,
//       price,
//       registrationNumber,
//       warrantyInfo,
//       isActive,
//       adminCreatedBy,
//       adminCompanyName,
//       LocalAuthority,
//     } = formDataObjectt;

//     const { height = "", width = "", length = "" } = dimensions; // Provide default values

//     console.log(height, width, length);

//     // Validate required fields
//     if (!registrationNumber || !manufacturer || !model) {
//       return NextResponse.json({
//         error: "Registration number, manufacturer, and model are required",
//         status: 400,
//       });
//     }

//     // Check for existing vehicle
//     const existingVehicle = await Vehicle.findOne({ registrationNumber });
//     if (existingVehicle) {
//       return NextResponse.json({
//         error: "Vehicle with this registration number already exists",
//         status: 400,
//       });
//     }

//     // Create new vehicle
//     const newVehicle = new Vehicle({
//       manufacturer,
//       model,
//       year,
//       type,
//       engineType,
//       fuelType,
//       transmission,
//       drivetrain,
//       exteriorColor,
//       interiorColor,
//       dimensions: { height, width, length },
//       passengerCapacity,
//       cargoCapacity,
//       horsepower,
//       torque,
//       topSpeed,
//       vehicleStatus,
//       towingCapacity,
//       fuelEfficiency,
//       safetyFeatures,
//       techFeatures,
//       price,
//       registrationNumber,
//       warrantyInfo,
//       isActive,
//       adminCreatedBy,
//       adminCompanyName,
//       LocalAuthority,
//       imageFile: Driveravatar,
//       imagePublicId: DriveravatarId,
//     });

//     const savedVehicle = await newVehicle.save();
//     return NextResponse.json({
//       message: "Vehicle created successfully",
//       success: true,
//       vehicle: savedVehicle,
//       status: 201,
//     });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     return NextResponse.json({
//       error: error.message || "Internal Server Error",
//       status: 500,
//     });
//   }
// }
export async function POST(request) {
  try {
    await connect();

    // Parse JSON data from the request body
    const formDataObject = await request.formData();

    // Retrieve up to 10 images
    const files = [];
    for (let i = 0; i < 10; i++) {
      const file = formDataObject.get(`imageFiles${i + 1}`);
      console.log(file);
      if (file) {
        files.push(file);
      }
    }

    console.log("Vehicle Images:", files);

    const images = []; // To store Cloudinary URLs and IDs

    // Upload files to Cloudinary
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
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

      images.push({
        url: uploadResponse.secure_url, // Cloudinary URL for display image
        publicId: uploadResponse.public_id,
      });
    }

    // Prepare object excluding image files
    const formDataObjectt = {};
    for (const [key, value] of formDataObject.entries()) {
      if (!key.startsWith("imageFiles")) {
        // Exclude image files
        formDataObjectt[key] = value;
      }
    }

    console.log(formDataObjectt);

    // Destructure the properties safely
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
      dimensions = {}, // Provide default empty object
      passengerCapacity,
      cargoCapacity,
      horsepower,
      torque,
      topSpeed,
      towingCapacity,
      fuelEfficiency,
      safetyFeatures,
      vehicleStatus,
      techFeatures,
      price,
      registrationNumber,
      warrantyInfo,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      LocalAuthority,
    } = formDataObjectt;

    const { height = "", width = "", length = "" } = dimensions; // Provide default values

    console.log(height, width, length);

    // Validate required fields
    if (!registrationNumber || !manufacturer || !model) {
      return NextResponse.json({
        error: "Registration number, manufacturer, and model are required",
        status: 400,
      });
    }

    // Check for existing vehicle
    const existingVehicle = await Vehicle.findOne({ registrationNumber });
    if (existingVehicle) {
      return NextResponse.json({
        error: "Vehicle with this registration number already exists",
        status: 400,
      });
    }

    // Create new vehicle
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
      dimensions: { height, width, length },
      passengerCapacity,
      cargoCapacity,
      horsepower,
      torque,
      topSpeed,
      vehicleStatus,
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
      images, // Store all image URLs and IDs
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
