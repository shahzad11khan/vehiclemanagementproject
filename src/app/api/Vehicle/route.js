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
    await connect(); // Connect to the database

    // Parse the form data from the request
    const formDataObject = await request.formData();
    // console.log(formDataObject);
    const files = formDataObject.getAll("imageFiles[]"); // Get all files
    console.log(files);
    const images = []; // To store Cloudinary URLs and IDs
    if (files.length === 0) {
      // No files found in form data
      images.push({
        url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/default-vehicle-image.jpg",
        publicId: "123456789",
      });
      // return NextResponse.json({
      //   error: "No files found in form data.",
      //   status: 400, // Bad Request
      // });
    } else if (files.length > 10) {
      // More than 10 files uploaded
      return NextResponse.json({
        error: "You can upload a maximum of 10 images.",
        status: 400, // Bad Request
      });
    } else {
      console.log(`Found ${files.length} file(s).`);
    }

    // Upload files to Cloudinary
    for (const file of files) {
      // Ensure the file is valid
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer
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
      } else {
        console.log("Invalid file detected:", file); // Debug if the file is invalid
      }
    }

    // Collect non-image fields from the form data
    const formDataObjectt = {};
    for (const [key, value] of formDataObject.entries()) {
      if (!key.startsWith("imageFiles[]")) {
        formDataObjectt[key] = value; // Exclude image files from regular form fields
      }
    }

    // Destructure the properties safely (ensure all fields are present)
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
      height,
      width,
      length,
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

    // Validate required fields
    if (!registrationNumber || !manufacturer || !model) {
      return NextResponse.json({
        error: "Registration number, manufacturer, and model are required",
        status: 400,
      });
    }

    // Check for existing vehicle with the same registration number
    const existingVehicle = await Vehicle.findOne({ registrationNumber });
    if (existingVehicle) {
      return NextResponse.json({
        error: "Vehicle with this registration number already exists",
        status: 400,
      });
    }

    // Create a new vehicle entry in the database
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
      height,
      width,
      length,
      passengerCapacity,
      cargoCapacity,
      horsepower,
      torque,
      topSpeed,
      towingCapacity,
      fuelEfficiency,
      safetyFeatures,
      techFeatures,
      vehicleStatus,
      price,
      registrationNumber,
      warrantyInfo,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      LocalAuthority,
      images, // Include image URLs and Cloudinary public IDs
    });

    // Save the vehicle in the database
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
