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
      default: "Standby",
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
    listPrice: {
      type: Number,
    },
    purchasePrice: {
      type: Number,
    },
    insuranceValue: {
      type: Number,
    },
    departmentCode: {
      type: String,
    },

    maintenance: {
      type: Boolean,
      default: false,
    },

    issues_damage: {
      type: String,
    },
    damage_image: {
      type: String,
    },
    recovery: {
      type: String,
    },
    organization: {
      type: String,
    },
    repairStatus: {
      type: String,
    },
    jobNumber: {
      type: Number,
    },
    memo: {
      type: String,
    },
    partNumber: {
      type: Number,
    },
    partName: {
      type: String,
    },
    partprice: {
      type: Number,
    },
    partsupplier: {
      type: String,
    },
    TestDate: {
      type: String,
    },
    PlateExpiryDate: {
      type: String,
    },
    Insurance: {
      type: String,
    },
    insurancePolicyNumber: {
      type: String,
    },
    PDFofPolicyUrl: {
      type: String,
    },
    PDFofPolicyPublicId: { type: String },
    defect: { type: String },
    Defectdate: { type: String },
    defectstatus: { type: String },
    defectdescription: { type: String },
    defectaction: { type: String },

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
    damageImage: [
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
    cardocuments: [
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
