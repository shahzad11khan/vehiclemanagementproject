// models/Vehicle.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
    },
    model: {
      type: String,
    },
    year: {
      type: Number,
    },
    type: {
      type: String,
    },
    engineType: {
      type: String,
    },
    fuelType: {
      type: String,
    },
    transmission: {
      type: String,
    },
    drivetrain: {
      type: String,
    },
    exteriorColor: {
      type: String,
    },
    interiorColor: {
      type: String,
    },
    dimensions: {
      height: { type: String },
      width: { type: String },
      length: { type: String },
    },
    passengerCapacity: {
      type: Number,
    },
    cargoCapacity: {
      type: String,
    },
    horsepower: {
      type: String,
    },
    torque: {
      type: String,
    },
    topSpeed: {
      type: String,
    },
    towingCapacity: {
      type: String,
    },
    fuelEfficiency: {
      type: String,
    },
    safetyFeatures: {
      type: String,
    },
    techFeatures: {
      type: String,
    },
    price: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    warrantyInfo: {
      type: String,
    },
    LocalAuthority: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    authority: {
      type: String,
    },
    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
  },
  { timestamps: true }
);

// Prevents recompilation of model during hot reloads
export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", vehicleSchema);
