import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { NextResponse } from "next/server";
import cloudinary from "@middlewares/cloudinary.js";

export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.VehicleID;
    const formDataObject = await request.formData(); // Ensure to await formData
    console.log(id, formDataObject);
    const imageFiles = formDataObject.getAll("imageFiles[]"); // Get all image files
    const safetyFeatures = formDataObject.getAll("safetyFeatures[]"); // Get all safety features
    const techFeatures = formDataObject.getAll("techFeatures[]"); // Get all tech features
    const damage_image = formDataObject.getAll("damage_image[]"); // Get all files
    const cardocument = formDataObject.getAll("cardocuments[]"); // Get all files
    const pdfofpolicy = formDataObject.get("PDFofPolicy[]"); // Get all files

    // console.log(pdfofpolicy);

    console.log("car documents", cardocument);
    // console.log("imageFiles ", imageFiles);
    const images = []; // To store Cloudinary URLs and IDs
    const damageImage = [];
    const cardocuments = [];
    let PDFofPolicyUrl = "";
    let PDFofPolicyPublicId = "";

    const vehicle = await Vehicle.findById(id); // Fetch vehicle by ID directly
    // console.log(vehicle);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found", status: 404 });
    }

    // console.log(pdfofpolicy.name);

    if (pdfofpolicy && typeof pdfofpolicy === "object" && pdfofpolicy.name) {
      const byteData = await pdfofpolicy.arrayBuffer();
      const buffer = Buffer.from(byteData);

      // Upload the new image to Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Write buffer to the upload stream
        uploadStream.end(buffer);
      });

      PDFofPolicyUrl = uploadResponse.secure_url;
      PDFofPolicyPublicId = uploadResponse.public_id;
    }
    // Handle avatar update: remove old avatar from Cloudinary and update with new one if uploaded
    if (PDFofPolicyUrl && PDFofPolicyPublicId) {
      if (vehicle.PDFofPolicyPublicId) {
        try {
          // Delete old avatar from Cloudinary if it exists
          await cloudinary.uploader.destroy(vehicle.PDFofPolicyPublicId);
          console.log("Old avatar deleted from Cloudinary.");
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Update user with new avatar details
      vehicle.PDFofPolicyUrl = PDFofPolicyUrl;
      vehicle.PDFofPolicyPublicId = PDFofPolicyPublicId;
      console.log("New avatar uploaded and updated PDFs.");
    }

    // for imageFiles variables
    // Handle image uploads to Cloudinary
    for (const file of imageFiles) {
      console.log("Processing file line 204:", file.name); // Log the name of each file

      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("Buffer created for file line 208:", file.name); // Log when buffer is created

        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) {
                console.error("Error uploading images Array", error.message); // Log the error if upload fails
                reject(new Error("Error uploading image: " + error.message));
              } else {
                console.log(
                  "Successfully uploaded image: line 217",
                  result.secure_url
                ); // Log the successful upload
                resolve(result);
              }
            })
            .end(buffer);
        });

        images.push({
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        });

        console.log("Image added to list line Images Array:", {
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        }); // Log each image data added to the array
      }
    }

    // Log the list of images before proceeding
    // console.log("All images uploaded: line 237", images);
    if (images.length > 0) {
      console.log("Images present, starting update process", vehicle.images);

      // Optionally: Delete old images from Cloudinary
      for (let i = 0; i < vehicle.images.length; i++) {
        if (vehicle.images[i].publicId) {
          console.log(
            "Old image publicId to delete: line 243",
            vehicle.images[i].publicId
          ); // Log the publicId of the old image

          // Delete the image from Cloudinary
          const deleteResponse = await cloudinary.uploader.destroy(
            vehicle.images[i].publicId
          );
          console.log("Delete response: line 256", deleteResponse);

          console.log(
            "Old image deleted from Cloudinary: line 246",
            vehicle.images[i].publicId
          ); // Log the deletion confirmation
        }
      }

      // Update the vehicle with new images
      vehicle.images = images; // Directly assign the new images array
      console.log("Vehicle updated with new images: line 255", vehicle.images); // Log the updated vehicle images
    }

    // for damage_image variables
    // Handle image uploads to Cloudinary
    for (const file of damage_image) {
      console.log("Processing file line 204:", file.name); // Log the name of each file

      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("Buffer created for file line 208:", file.name); // Log when buffer is created

        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) {
                console.error(
                  "Error uploading image Damage File",
                  error.message
                ); // Log the error if upload fails
                reject(new Error("Error uploading image: " + error.message));
              } else {
                console.log(
                  "Successfully uploaded image Damage File",
                  result.secure_url
                ); // Log the successful upload
                resolve(result);
              }
            })
            .end(buffer);
        });

        damage_image.push({
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        });

        console.log("Image added to list line 229:", {
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        }); // Log each image data added to the array
      }
    }

    if (damageImage.length > 0) {
      console.log("Images present, starting update process", vehicle.images);

      // Optionally: Delete old images from Cloudinary
      for (let i = 0; i < vehicle.damageImage.length; i++) {
        if (vehicle.damageImage[i].publicId) {
          console.log(
            "Old image publicId to delete: line 243",
            vehicle.damageImage[i].publicId
          ); // Log the publicId of the old image

          // Delete the image from Cloudinary
          const deleteResponse = await cloudinary.uploader.destroy(
            vehicle.damageImage[i].publicId
          );
          console.log("Delete response: line 256", deleteResponse);

          console.log(
            "Old image deleted from Cloudinary: line 246",
            vehicle.damageImage[i].publicId
          ); // Log the deletion confirmation
        }
      }

      // Update the vehicle with new images
      vehicle.damageImage = damageImage; // Directly assign the new images array
      console.log(
        "Vehicle updated with new images: line 255",
        vehicle.damageImage
      ); // Log the updated vehicle images
    }
    // for cardocuments variables
    // Handle image uploads to Cloudinary
    for (const file of cardocument) {
      console.log("Processing file line 204:", file.name); // Log the name of each file

      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("Buffer created for file line 208:", file.name); // Log when buffer is created

        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) {
                console.error("Error uploading image: line 214", error.message); // Log the error if upload fails
                reject(new Error("Error uploading image: " + error.message));
              } else {
                console.log(
                  "Successfully uploaded image CarDocuments",
                  result.secure_url
                ); // Log the successful upload
                resolve(result);
              }
            })
            .end(buffer);
        });

        cardocuments.push({
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        });

        console.log("Image added to list line 229:", {
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
        }); // Log each image data added to the array
      }
    }

    // console.log("All images uploaded: line 237", cardocuments);
    if (cardocument.length > 0) {
      console.log(
        "Images present, starting update process",
        vehicle.cardocuments
      );

      // Optionally: Delete old images from Cloudinary
      for (let i = 0; i < vehicle.cardocuments.length; i++) {
        if (vehicle.cardocuments[i].publicId) {
          console.log(
            "Old image publicId to delete CarDocument",
            vehicle.cardocuments[i].publicId
          ); // Log the publicId of the old image

          // Delete the image from Cloudinary
          const deleteResponse = await cloudinary.uploader.destroy(
            vehicle.cardocuments[i].publicId
          );
          console.log("Delete response Cardocumens", deleteResponse);

          console.log(
            "Old image deleted from Cloudinary CarDocuments line 246",
            vehicle.cardocuments[i].publicId
          ); // Log the deletion confirmation
        }
      }

      // Update the vehicle with new images
      vehicle.cardocuments = cardocuments; // Directly assign the new images array
      console.log(
        "Vehicle updated with new images: line 255",
        vehicle.cardocuments
      ); // Log the updated vehicle images
    }

    // Update vehicle properties
    vehicle.manufacturer =
      formDataObject.get("manufacturer") || vehicle.manufacturer;
    vehicle.model = formDataObject.get("model") || vehicle.model;
    vehicle.year = formDataObject.get("year") || vehicle.year;
    vehicle.vehicleStatus =
      formDataObject.get("vehicleStatus") || vehicle.vehicleStatus;
    vehicle.type = formDataObject.get("type") || vehicle.type;
    vehicle.engineType = formDataObject.get("engineType") || vehicle.engineType;
    vehicle.fuelType = formDataObject.get("fuelType") || vehicle.fuelType;
    vehicle.transmission =
      formDataObject.get("transmission") || vehicle.transmission;
    vehicle.drivetrain = formDataObject.get("drivetrain") || vehicle.drivetrain;
    vehicle.exteriorColor =
      formDataObject.get("exteriorColor") || vehicle.exteriorColor;
    vehicle.interiorColor =
      formDataObject.get("interiorColor") || vehicle.interiorColor;
    vehicle.height = formDataObject.get("height") || vehicle.height;
    vehicle.width = formDataObject.get("width") || vehicle.width;
    vehicle.length = formDataObject.get("length") || vehicle.length;
    vehicle.passengerCapacity =
      formDataObject.get("passengerCapacity") || vehicle.passengerCapacity;
    vehicle.cargoCapacity =
      formDataObject.get("cargoCapacity") || vehicle.cargoCapacity;
    vehicle.horsepower = formDataObject.get("horsepower") || vehicle.horsepower;
    vehicle.torque = formDataObject.get("torque") || vehicle.torque;
    vehicle.topSpeed = formDataObject.get("topSpeed") || vehicle.topSpeed;
    vehicle.towingCapacity =
      formDataObject.get("towingCapacity") || vehicle.towingCapacity;
    vehicle.fuelEfficiency =
      formDataObject.get("fuelEfficiency") || vehicle.fuelEfficiency;
    vehicle.safetyFeatures =
      safetyFeatures.length > 0 ? [...safetyFeatures] : vehicle.safetyFeatures;
    vehicle.techFeatures =
      techFeatures.length > 0 ? [...techFeatures] : vehicle.techFeatures;
    vehicle.price = formDataObject.get("price") || vehicle.price;
    vehicle.registrationNumber =
      formDataObject.get("registrationNumber") || vehicle.registrationNumber;
    vehicle.warrantyInfo =
      formDataObject.get("warrantyInfo") || vehicle.warrantyInfo;
    vehicle.isActive =
      formDataObject.get("isActive") !== undefined
        ? formDataObject.get("isActive") === "true"
        : vehicle.isActive;
    vehicle.adminCreatedBy =
      formDataObject.get("adminCreatedBy") || vehicle.adminCreatedBy;
    vehicle.adminCompanyName =
      formDataObject.get("adminCompanyName") || vehicle.adminCompanyName;
    // new fields
    vehicle.enginesize = formDataObject.get("enginesize") || vehicle.enginesize;
    vehicle.chasisnumber =
      formDataObject.get("chasisnumber") || vehicle.chasisnumber;
    vehicle.vehicleSite =
      formDataObject.get("vehicleSite") || vehicle.vehicleSite;
    vehicle.fleetEntryDate =
      formDataObject.get("fleetEntryDate") || vehicle.fleetEntryDate;
    vehicle.milesOnFleetEntry =
      formDataObject.get("milesOnFleetEntry") || vehicle.milesOnFleetEntry;
    vehicle.plannedFleetExit =
      formDataObject.get("plannedFleetExit") || vehicle.plannedFleetExit;
    vehicle.milesOnFleetExit =
      formDataObject.get("milesOnFleetExit") || vehicle.milesOnFleetExit;
    vehicle.actualExitDate =
      formDataObject.get("actualExitDate") || vehicle.actualExitDate;
    vehicle.milesAtActualExit =
      formDataObject.get("milesAtActualExit") || vehicle.milesAtActualExit;
    vehicle.doors = formDataObject.get("doors") || vehicle.doors;
    vehicle.color = formDataObject.get("color") || vehicle.color;
    vehicle.editablecolor =
      formDataObject.get("editablecolor") || vehicle.editablecolor;
    vehicle.roadTaxDate =
      formDataObject.get("roadTaxDate") || vehicle.roadTaxDate;
    vehicle.roadTaxCycle =
      formDataObject.get("roadTaxCycle") || vehicle.roadTaxCycle;
    vehicle.motDueDate = formDataObject.get("motDueDate") || vehicle.motDueDate;
    vehicle.motCycle = formDataObject.get("motCycle") || vehicle.motCycle;
    vehicle.seats = formDataObject.get("seats") || vehicle.seats;
    vehicle.abiCode = formDataObject.get("abiCode") || vehicle.abiCode;
    vehicle.nextServiceDate =
      formDataObject.get("nextServiceDate") || vehicle.nextServiceDate;
    vehicle.nextServiceMiles =
      formDataObject.get("nextServiceMiles") || vehicle.nextServiceMiles;
    vehicle.roadTaxCost =
      formDataObject.get("roadTaxCost") || vehicle.roadTaxCost;
    vehicle.listPrice = formDataObject.get("listPrice") || vehicle.listPrice;
    vehicle.purchasePrice =
      formDataObject.get("purchasePrice") || vehicle.purchasePrice;
    vehicle.insuranceValue =
      formDataObject.get("insuranceValue") || vehicle.insuranceValue;
    vehicle.departmentCode =
      formDataObject.get("departmentCode") || vehicle.departmentCode;
    vehicle.departmentCode =
      formDataObject.get("departmentCode") || vehicle.departmentCode;
    vehicle.maintenance =
      formDataObject.get("maintenance") !== undefined
        ? formDataObject.get("maintenance") === "true"
        : vehicle.maintenance;

    vehicle.issues_damage =
      formDataObject.get("issues_damage") || vehicle.issues_damage;
    vehicle.recovery = formDataObject.get("recovery") || vehicle.recovery;
    vehicle.organization =
      formDataObject.get("organization") || vehicle.organization;
    vehicle.repairStatus =
      formDataObject.get("repairStatus") || vehicle.repairStatus;
    vehicle.jobNumber = formDataObject.get("jobNumber") || vehicle.jobNumber;
    vehicle.memo = formDataObject.get("memo") || vehicle.memo;
    vehicle.partNumber = formDataObject.get("partNumber") || vehicle.partNumber;
    vehicle.partName = formDataObject.get("partName") || vehicle.partName;
    vehicle.partprice = formDataObject.get("partprice") || vehicle.partprice;
    vehicle.partsupplier =
      formDataObject.get("partsupplier") || vehicle.partsupplier;
    vehicle.TestDate = formDataObject.get("TestDate") || vehicle.TestDate;
    vehicle.PlateExpiryDate =
      formDataObject.get("PlateExpiryDate") || vehicle.PlateExpiryDate;
    vehicle.Insurance = formDataObject.get("Insurance") || vehicle.Insurance;
    vehicle.insurancePolicyNumber =
      formDataObject.get("insurancePolicyNumber") ||
      vehicle.insurancePolicyNumber;
    vehicle.defect = formDataObject.get("defect") || vehicle.defect;
    vehicle.Defectdate = formDataObject.get("Defectdate") || vehicle.Defectdate;
    vehicle.defectstatus =
      formDataObject.get("defectstatus") || vehicle.defectstatus;
    vehicle.defectdescription =
      formDataObject.get("defectdescription") || vehicle.defectdescription;
    vehicle.defectaction =
      formDataObject.get("defectaction") || vehicle.defectaction;
    vehicle.additionalInfo =
      formDataObject.get("additionalInfo") || vehicle.additionalInfo;
    vehicle.RPCExpiryDate =
      formDataObject.get("RPCExpiryDate") || vehicle.RPCExpiryDate;
    vehicle.tailLiftExpirydate =
      formDataObject.get("tailLiftExpirydate") || vehicle.tailLiftExpirydate;
    vehicle.forkLiftNumber =
      formDataObject.get("forkLiftNumber") || vehicle.forkLiftNumber;
    vehicle.ForkLiftInspectionDate =
      formDataObject.get("ForkLiftInspectionDate") ||
      vehicle.ForkLiftInspectionDate;

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

export async function GET(request, context) {
  try {
    // Connect to the database
    await connect();

    // Extract the product ID from the request parameters
    const id = context.params.VehicleID;
    // console.log(id);

    // Find the product by ID
    const Find_User = await Vehicle.findById(id);

    // console.log(Find_User);

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
    const imagesPublicIdd = deletedVehicle.images.publicId;
    const damageImagePublicIddd = deletedVehicle.damageImage.publicId;
    const PDFofPolicyPublicId = deletedVehicle.PDFofPolicyPublicId;
    const cardocumentPublicId = deletedVehicle.cardocuments;
    console.log("imagesPublicIdd Public ID:", imagesPublicIdd);
    console.log("damageImagePublicIddd Public ID:", damageImagePublicIddd);
    console.log("PDFofPolicyPublicId Public ID:", PDFofPolicyPublicId);
    console.log("cardocuments Public ID:", cardocumentPublicId);

    // If the vehicle has an associated image, delete it from Cloudinary
    if (
      imagesPublicIdd &&
      damageImagePublicIddd &&
      PDFofPolicyPublicId &&
      cardocumentPublicId
    ) {
      try {
        const cloudinaryResponse1 = await cloudinary.uploader.destroy(
          imagesPublicIdd
        );
        const cloudinaryResponse2 = await cloudinary.uploader.destroy(
          damageImagePublicIddd
        );
        const cloudinaryResponse3 = await cloudinary.uploader.destroy(
          PDFofPolicyPublicId
        );
        const cloudinaryResponse4 = await cloudinary.uploader.destroy(
          cardocumentPublicId
        );

        console.log(`Cloudinary response: ${cloudinaryResponse1.result}`);
        console.log(`Cloudinary response: ${cloudinaryResponse2.result}`);
        console.log(`Cloudinary response: ${cloudinaryResponse3.result}`);
        console.log(`Cloudinary response: ${cloudinaryResponse4.result}`);
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
