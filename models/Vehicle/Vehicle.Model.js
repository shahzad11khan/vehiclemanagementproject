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

    height: { type: Number, dufault: 0 },
    width: { type: Number, default: 0 },
    length: { type: Number, default: 0 },

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
      type: [String],
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
    enginesize: {
      type: Number,
    },
    chasisnumber: {
      type: String,
    },
    vehicleSite: {
      type: String,
    },
    fleetEntryDate: {
      type: String,
    },
    milesOnFleetEntry: {
      type: String,
    },
    plannedFleetExit: {
      type: String,
    },
    milesOnFleetExit: {
      type: String,
    },
    actualExitDate: {
      type: String,
    },
    milesAtActualExit: {
      type: String,
    },
    doors: {
      type: Number,
    },
    color: {
      type: String,
    },
    editablecolor: {
      type: String,
    },
    roadTaxDate: {
      type: String,
    },
    roadTaxCycle: {
      type: String,
    },
    motDueDate: {
      type: String,
    },
    motCycle: {
      type: String,
    },
    seats: {
      type: String,
    },
    seats: {
      type: Number,
    },
    abiCode: {
      type: String,
    },
    nextServiceDate: {
      type: String,
    },
    nextServiceMiles: {
      type: Number,
    },
    roadTaxCost: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    imageFile: { type: String, default: null },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
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
