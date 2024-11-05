import { connect } from "@config/db.js";
import Vehicle from "@models/Vehicle/Vehicle.Model.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await connect();

    // Extract the vehicle ID from the request parameters
    const id = params.getspecificvehicleid; // Ensure correct parameter name
    console.log("Vehicle getspecificvehicleid:", id);

    // Attempt to find the vehicle by ID
    const foundVehicle = await Vehicle.findById(id);
    console.log("Found Vehicle:", foundVehicle);

    // Check if the vehicle was found
    if (!foundVehicle) {
      // No records found
      return NextResponse.json({ result: "No Vehicle Found", status: 404 });
    }

    // Return the found vehicle as a JSON response
    return NextResponse.json({ result: foundVehicle, status: 200 });
  } catch (error) {
    console.error("Error retrieving vehicle:", error);
    // Return an error response
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
