// import { connect } from "@config/db.js";
// import Vehicle from "@models/Vehicle/Vehicle.Model.js";
// import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
// import { NextResponse } from "next/server";
// import cloudinary from "@middlewares/cloudinary.js";

// export async function POST(request) {
//   try {
//     await connect(); // Connect to the database

//     // Parse the form data from the request
//     const formDataObject = await request.formData();
//     console.log(formDataObject);
//     const safetyFeature = formDataObject.getAll("safetyFeatures[]"); // Get all files
//     const techFeature = formDataObject.getAll("techFeatures[]"); // Get all files
//     const files = formDataObject.getAll("imageFiles[]"); // Get all files
//     const damage_image = formDataObject.getAll("damage_image[]"); // Get all files
//     const cardocument = formDataObject.getAll("cardocuments[]"); // Get all files
//     const pdfofpolicy = formDataObject.get("PDFofPolicy[]"); // Get all files
//     const images = []; // To store Cloudinary URLs and IDs
//     const damageImage = [];
//     const cardocuments = [];
//     // console.log("cardocuments", cardocument);
//     // console.log(pdfofpolicy);

//     let pdfofpolicyUrl = "";
//     let pdfofpolicyPublicId = "";

//     if (!pdfofpolicy) {
//       pdfofpolicyUrl =
//         "https://www.smartcaptech.com/wp-content/uploads/sample.pdf";
//       pdfofpolicyPublicId = "123456789";
//     } else {
//       try {
//         const buffer1 = Buffer.from(await pdfofpolicy.arrayBuffer());
//         const uploadResponse1 = await new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream(
//               {
//                 resource_type: "auto",
//               },
//               (error, result) => {
//                 if (error) {
//                   reject(
//                     new Error("Error uploading displayImage: " + error.message)
//                   );
//                 } else {
//                   resolve(result);
//                 }
//               }
//             )
//             .end(buffer1);
//         });

//         pdfofpolicyUrl = uploadResponse1.secure_url; // Cloudinary URL for display image
//         pdfofpolicyPublicId = uploadResponse1.public_id;
//       } catch (error) {
//         pdfofpolicyUrl =
//           "https://www.smartcaptech.com/wp-content/uploads/sample.pdf";
//         pdfofpolicyPublicId = "123456789";
//       }
//     }

//     // for files
//     if (files.length === 0) {
//       // No files found in form data
//       images.push({
//         url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVU1ne0ThYY7sT5PkP_HJ0dRIJ4lGOTnqQXQ&s",
//         publicId: "123456789",
//       });
//     } else if (files.length > 10) {
//       // More than 10 files uploaded
//       return NextResponse.json({
//         error: "You can upload a maximum of 10 images.",
//         status: 400, // Bad Request
//       });
//     } else {
//       console.log(`Found ${files.length} file(s).`);
//     }
//     // for files
//     // Upload files to Cloudinary
//     for (const file of files) {
//       // Ensure the file is valid
//       if (file instanceof File) {
//         const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer
//         // Upload to Cloudinary
//         const uploadResponse = await new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream({ resource_type: "auto" }, (error, result) => {
//               if (error) {
//                 reject(new Error("Error uploading image: " + error.message));
//               } else {
//                 resolve(result);
//               }
//             })
//             .end(buffer); // Send buffer to Cloudinary
//         });

//         // Store Cloudinary response (URL and public ID)
//         images.push({
//           url: uploadResponse.secure_url,
//           publicId: uploadResponse.public_id,
//         });
//       } else {
//         console.log("Invalid file detected:", file); // Debug if the file is invalid
//       }
//     }

//     // for damage_files
//     if (damage_image.length === 0) {
//       // No files found in form data
//       damageImage.push({
//         url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVU1ne0ThYY7sT5PkP_HJ0dRIJ4lGOTnqQXQ&s",
//         publicId: "123456789",
//       });
//     } else if (damage_image.length > 5) {
//       // Limit to 5 damage images
//       return NextResponse.json({
//         error: "You can upload a maximum of 5 damage images.",
//         status: 400,
//       });
//     } else {
//       console.log(`Found ${damage_image.length} damage image(s).`);
//     }
//     // for damage_files
//     // Upload files to Cloudinary
//     for (const file of damage_image) {
//       // Ensure the file is valid
//       if (file instanceof File) {
//         const buffer = Buffer.from(await file.arrayBuffer());
//         // Upload to Cloudinary
//         const uploadResponse = await new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream({ resource_type: "auto" }, (error, result) => {
//               if (error) {
//                 reject(new Error("Error uploading image: " + error.message));
//               } else {
//                 resolve(result);
//               }
//             })
//             .end(buffer); // Send buffer to Cloudinary
//         });

//         // Store Cloudinary response (URL and public ID)
//         damageImage.push({
//           url: uploadResponse.secure_url,
//           publicId: uploadResponse.public_id,
//         });
//       } else {
//         console.log("Invalid file detected:", file); // Debug if the file is invalid
//       }
//     }

//     // for cardocuments
//     if (cardocument.length === 0) {
//       // No files found in form data
//       cardocuments.push({
//         url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVU1ne0ThYY7sT5PkP_HJ0dRIJ4lGOTnqQXQ&s",
//         publicId: "123456789",
//       });
//     } else if (cardocument.length > 5) {
//       // More than 10 files uploaded
//       return NextResponse.json({
//         error: "You can upload a maximum of 10 images.",
//         status: 400, // Bad Request
//       });
//     } else {
//       console.log(`Found ${cardocument.length} cardcument file(s).`);
//     }
//     // for cardocuments
//     // Upload files to Cloudinary
//     for (const file of cardocument) {
//       // Ensure the file is valid
//       if (file instanceof File) {
//         const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer
//         // Upload to Cloudinary
//         const uploadResponse = await new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream({ resource_type: "auto" }, (error, result) => {
//               if (error) {
//                 reject(new Error("Error uploading image: " + error.message));
//               } else {
//                 resolve(result);
//               }
//             })
//             .end(buffer); // Send buffer to Cloudinary
//         });

//         // Store Cloudinary response (URL and public ID)
//         cardocuments.push({
//           url: uploadResponse.secure_url,
//           publicId: uploadResponse.public_id,
//         });
//       } else {
//         console.log("Invalid file detected:", file); // Debug if the file is invalid
//       }
//     }

//     // Collect non-image fields from the form data
//     const formDataObjectt = {};
//     for (const [key, value] of formDataObject.entries()) {
//       if (
//  !key.startsWith("imageFiles[]") &&
//         !key.startsWith("damage_image[]") &&
//         !key.startsWith("pdfofpolicy[]") &&
//         !key.startsWith("cardocuments[]")
//       ) {
//         formDataObjectt[key] = value; // Exclude image files from regular form fields
//       }
//     }

//     // Destructure the properties safely (ensure all fields are present)
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
//       height,
//       width,
//       length,
//       passengerCapacity,
//       cargoCapacity,
//       horsepower,
//       torque,
//       topSpeed,
//       towingCapacity,
//       fuelEfficiency,
//       vehicleStatus,
//       price,
//       registrationNumber,
//       warrantyInfo,
//       isActive,
//       adminCreatedBy,
//       adminCompanyName,
//       LocalAuthority,
//       // new fields
//       enginesize,
//       chasisnumber,
//       vehicleSite,
//       fleetEntryDate,
//       milesOnFleetEntry,
//       plannedFleetExit,
//       milesOnFleetExit,
//       actualExitDate,
//       milesAtActualExit,
//       doors,
//       color,
//       editablecolor,
//       roadTaxDate,
//       roadTaxCycle,
//       motDueDate,
//       motCycle,
//       seats,
//       abiCode,
//       nextServiceDate,
//       nextServiceMiles,
//       roadTaxCost,
//       listPrice,
//       purchasePrice,
//       insuranceValue,
//       departmentCode,
//       maintenance,
//       issues_damage,
//       recovery,
//       organization,
//       repairStatus,
//       jobNumber,
//       memo,
//       partNumber,
//       partName,
//       partprice,
//       partsupplier,
//       TestDate,
//       PlateExpiryDate,
//       Insurance,
//       insurancePolicyNumber,
//       defect,
//       Defectdate,
//       defectstatus,
//       defectdescription,
//       defectaction,
//       additionalInfo,
//       RPCExpiryDate,
//       tailLiftExpirydate,
//       forkLiftNumber,
//       ForkLiftInspectionDate,
//     } = formDataObjectt;

//     // Validate required fields
//     if (!registrationNumber || !manufacturer || !model) {
//       return NextResponse.json({
//         error: "Registration number, manufacturer, and model are required",
//         status: 400,
//       });
//     }

//     // Check for existing vehicle with the same registration number
//     const existingVehicle = await Vehicle.findOne({ registrationNumber });
//     if (existingVehicle) {
//       return NextResponse.json({
//         error: "Vehicle with this registration number already exists",
//         status: 400,
//       });
//     }

//     // Create a new vehicle entry in the database
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
//       height,
//       width,
//       length,
//       passengerCapacity,
//       cargoCapacity,
//       horsepower,
//       torque,
//       topSpeed,
//       towingCapacity,
//       safetyFeatures: safetyFeature,
//       fuelEfficiency,
//       techFeatures: techFeature,
//       vehicleStatus,
//       price,
//       registrationNumber,
//       warrantyInfo,
//       isActive,
//       adminCreatedBy,
//       adminCompanyName,
//       LocalAuthority,
//       images, // Include image URLs and Cloudinary public IDs
//       // new fields
//       enginesize,
//       chasisnumber,
//       vehicleSite,
//       fleetEntryDate,
//       milesOnFleetEntry,
//       plannedFleetExit,
//       milesOnFleetExit,
//       actualExitDate,
//       milesAtActualExit,
//       doors,
//       color,
//       editablecolor,
//       roadTaxDate,
//       roadTaxCycle,
//       motDueDate,
//       motCycle,
//       seats,
//       abiCode,
//       nextServiceDate,
//       nextServiceMiles,
//       roadTaxCost,
//       listPrice,
//       purchasePrice,
//       insuranceValue,
//       departmentCode,
//       maintenance,
//       issues_damage,
//       recovery,
//       organization,
//       repairStatus,
//       jobNumber,
//       memo,
//       partNumber,
//       partName,
//       partprice,
//       partsupplier,
//       damageImage,
//       TestDate,
//       PlateExpiryDate,
//       Insurance,
//       insurancePolicyNumber,
//       defect,
//       Defectdate,
//       defectstatus,
//       defectdescription,
//       defectaction,
//       additionalInfo,
//       RPCExpiryDate,
//       tailLiftExpirydate,
//       forkLiftNumber,
//       ForkLiftInspectionDate,
//       PDFofPolicyUrl: pdfofpolicyUrl,
//       PDFofPolicyPublicId: pdfofpolicyPublicId,
//       cardocuments,
//     });

//     // Save the vehicle in the database
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

import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { catchAsyncErrors } from "@middlewares/catchAsyncErrors.js";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request) {
  try {
    await connect(); // Connect to the database

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Parse the form data from the request
    const formDataObject = await request.formData();
    console.log(formDataObject);
    const safetyFeature = formDataObject.getAll("safetyFeatures[]");
    const techFeature = formDataObject.getAll("techFeatures[]");
    const files = formDataObject.getAll("imageFiles[]");
    const damage_image = formDataObject.getAll("damage_image[]");
    const cardocument = formDataObject.getAll("cardocuments[]");
    const pdfofpolicy = formDataObject.get("PDFofPolicy[]");

    const images = [];
    const damageImage = [];
    const cardocuments = [];
    let pdfofpolicyUrl = "";
    let pdfofpolicyName = "";

    // Handle PDF file (save to uploads folder)
    if (!pdfofpolicy) {
      pdfofpolicyUrl =
        "https://www.smartcaptech.com/wp-content/uploads/sample.pdf";
      pdfofpolicyName = "sample.pdf";
    } else {
      const pdfBuffer = Buffer.from(await pdfofpolicy.arrayBuffer());
      const pdfFileName = `${uuidv4()}.pdf`;
      const pdfFilePath = path.join(UPLOAD_DIR, pdfFileName);

      fs.writeFileSync(pdfFilePath, pdfBuffer); // Save the file to disk
      pdfofpolicyUrl = `/uploads/${pdfFileName}`; // Public URL for the file
      pdfofpolicyName = pdfFileName;
    }

    // Handle image files
    if (files.length === 0) {
      images.push({
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVU1ne0ThYY7sT5PkP_HJ0dRIJ4lGOTnqQXQ&s",
        publicId: "123456789",
      });
    } else if (files.length > 10) {
      return NextResponse.json({
        error: "You can upload a maximum of 10 images.",
        status: 400,
      });
    } else {
      console.log(`Found ${files.length} file(s).`);
    }

    // Upload image files
    for (const file of files) {
      // if (file instanceof File) {
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}.jpg`; // You can modify the extension based on file type
        const filePath = path.join(UPLOAD_DIR, fileName);

        fs.writeFileSync(filePath, buffer); // Save image to disk

        images.push({
          url: `/uploads/${fileName}`,
          publicId: fileName,
        });
      } else {
        console.log("Invalid file detected:", file); // Debug if the file is invalid
      }
    }

    // Upload damage images
    for (const file of damage_image) {
      // if (file instanceof File) {
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}_damage.jpg`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        fs.writeFileSync(filePath, buffer); // Save damage image to disk

        damageImage.push({
          url: `/uploads/${fileName}`,
          publicId: fileName,
        });
      } else {
        console.log("Invalid file detected:", file); // Debug if the file is invalid
      }
    }

    // Upload card documents
    for (const file of cardocument) {
      // if (file instanceof File) {
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}_cardocument.jpg`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        fs.writeFileSync(filePath, buffer); // Save card document to disk

        cardocuments.push({
          url: `/uploads/${fileName}`,
          publicId: fileName,
        });
      } else {
        console.log("Invalid file detected:", file); // Debug if the file is invalid
      }
    }

    // Collect non-image fields from the form data
    const formDataObjectt = {};
    for (const [key, value] of formDataObject.entries()) {
      if (
        !key.startsWith("imageFiles[]") &&
        !key.startsWith("damage_image[]") &&
        !key.startsWith("pdfofpolicy[]") &&
        !key.startsWith("cardocuments[]")
      ) {
        formDataObjectt[key] = value;
      }
    }

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
      vehicleStatus,
      price,
      registrationNumber,
      warrantyInfo,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      LocalAuthority,
      enginesize,
      chasisnumber,
      vehicleSite,
      fleetEntryDate,
      milesOnFleetEntry,
      plannedFleetExit,
      milesOnFleetExit,
      actualExitDate,
      milesAtActualExit,
      doors,
      color,
      editablecolor,
      roadTaxDate,
      roadTaxCycle,
      motDueDate,
      motCycle,
      seats,
      abiCode,
      nextServiceDate,
      nextServiceMiles,
      roadTaxCost,
      listPrice,
      purchasePrice,
      insuranceValue,
      departmentCode,
      maintenance,
      issues_damage,
      recovery,
      organization,
      repairStatus,
      jobNumber,
      memo,
      partNumber,
      partName,
      partprice,
      partsupplier,
      TestDate,
      PlateExpiryDate,
      Insurance,
      insurancePolicyNumber,
      defect,
      Defectdate,
      defectstatus,
      defectdescription,
      defectaction,
      additionalInfo,
      RPCExpiryDate,
      tailLiftExpirydate,
      forkLiftNumber,
      ForkLiftInspectionDate,
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
      safetyFeatures: safetyFeature,
      fuelEfficiency,
      techFeatures: techFeature,
      vehicleStatus: vehicleStatus || "Standby",
      price,
      registrationNumber,
      warrantyInfo,
      isActive,
      adminCreatedBy,
      adminCompanyName,
      LocalAuthority,
      images,
      enginesize,
      chasisnumber,
      vehicleSite,
      fleetEntryDate,
      milesOnFleetEntry,
      plannedFleetExit,
      milesOnFleetExit,
      actualExitDate,
      milesAtActualExit,
      doors,
      color,
      editablecolor,
      roadTaxDate,
      roadTaxCycle,
      motDueDate,
      motCycle,
      seats,
      abiCode,
      nextServiceDate,
      nextServiceMiles,
      roadTaxCost,
      listPrice,
      purchasePrice,
      insuranceValue,
      departmentCode,
      maintenance,
      issues_damage,
      recovery,
      organization,
      repairStatus,
      jobNumber,
      memo,
      partNumber,
      partName,
      partprice,
      partsupplier,
      damageImage,
      TestDate,
      PlateExpiryDate,
      Insurance,
      insurancePolicyNumber,
      defect,
      Defectdate,
      defectstatus,
      defectdescription,
      defectaction,
      additionalInfo,
      RPCExpiryDate,
      tailLiftExpirydate,
      forkLiftNumber,
      ForkLiftInspectionDate,
      PDFofPolicyUrl: pdfofpolicyUrl,
      PDFofPolicyPublicId: pdfofpolicyName,
      cardocuments,
    });

    await newVehicle.save();

    return NextResponse.json({
      success: true,
      message: "Vehicle uploaded successfully",
      vehicle: newVehicle,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}

export const GET = catchAsyncErrors(async () => {
  await connect();
  const allVehicle = await Vehicle.find().sort({ createdAt: -1 });
  const VehicleCount = await Vehicle.countDocuments();
  if (!allVehicle || allVehicle.length === 0) {
    return NextResponse.json({ result: allVehicle });
  } else {
    return NextResponse.json({ result: allVehicle, count: VehicleCount });
  }
});
