import { connect } from "@config/db.js";
import DriverInfo from "@models/DriverMoreInfo/DriverMoreInfo.model.js";
import { NextResponse } from "next/server";

// for update total substract and remainig payment
// PUT handler for updating driver details
export async function PUT(request, context) {
  try {
    await connect(); // Connect to the database

    const id = context.params.DriverMoreInfoIDD; // Use the correct parameter name
    const data = await request.formData(); // Retrieve form data

    // console.log("Received ID:", id);

    // Convert FormData to a plain object
    const formDataObject = Object.fromEntries(data.entries());
    // console.log("Form Data:", formDataObject); // Log incoming form data for debugging

    // Find the drivers by driverId
    const drivers = await DriverInfo.find({ driverId: id }); // Use find() to get an array of drivers
    // console.log(drivers);

    if (drivers.length === 0) {
      return NextResponse.json({ error: "Driver not found", status: 404 });
    }

    // Define the fields you want to update
    const fieldsToUpdate = [
      "totalamount", // Replace with your actual field names
      "totalsubtractamount", // Replace with your actual field names
      "totalremainingamount", // Replace with your actual field names
      "endDate", // Replace with your actual field names
    ];

    // console.log(fieldsToUpdate);
    // Update driver properties with values from formDataObject
    for (const driver of drivers) {
      fieldsToUpdate.forEach((field) => {
        if (formDataObject[field] !== undefined) {
          driver[field] = formDataObject[field];
        }
      });

      // Save updated driver details
      await driver.save();
    }

    return NextResponse.json({
      message: "Driver details updated successfully",
      drivers, // Return the updated drivers
      status: 200,
    });
  } catch (error) {
    console.error("Error updating driver details:", error);
    return NextResponse.json({
      error: "Failed to update driver details",
      status: 500,
    });
  }
}


