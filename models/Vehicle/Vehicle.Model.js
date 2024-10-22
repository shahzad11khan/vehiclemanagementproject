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
      height: { type: Number, dufault: 0 },
      width: { type: Number, default: 0 },
      length: { type: Number, default: 0 },
    },
    passengerCapacity: {
      type: Number,
    },
    cargoCapacity: {
      type: String,
    },
    horsepower: {
      type: Number,
    },
    torque: {
      type: Number,
    },
    topSpeed: {
      type: Number,
    },
    towingCapacity: {
      type: Number,
    },
    fuelEfficiency: {
      type: String,
    },
    safetyFeatures: {
      type: [String],
    },
    techFeatures: {
      type: String,
    },
    price: {
      type: Number,
    },
    registrationNumber: {
      type: String,
    },
    vehicleStatus: {
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
    imageFile: { type: String, default: null },
    imagePublicId: { type: String, default: null },
    authority: {
      type: String,
    },

    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
    adminCompanyId: { type: String },
  },
  { timestamps: true }
);

// Prevents recompilation of model during hot reloads
export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", vehicleSchema);
