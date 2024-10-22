// models/Driver.Model.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: String },
    tel1: { type: String },
    tel2: { type: String, default: null },
    email: { type: String },
    licenseNumber: { type: String, default: null },
    niNumber: { type: String, default: null },
    driverNumber: { type: String, default: null },
    taxiFirm: { type: String, default: null },
    badgeType: { type: String, default: null },
    insurance: { type: String, default: null },
    startDate: { type: String },
    driverRent: { type: Number, default: 0 },
    vehicle: { type: String },
    LocalAuth: { type: String },
    licenseExpiryDate: { type: String },
    taxiBadgeDate: { type: String },
    rentPaymentCycle: { type: String, default: null },
    city: { type: String, default: null },
    pay: { type: Number, default: 0 },
    county: { type: String, default: null },
    postcode: { type: String, default: null },
    postalAddress: { type: String, default: null },
    // permanentAddress: { type: String, default: null },
    imageFile: { type: String, default: null },
    imagePublicId: { type: String, default: null },
    imageName: { type: String, default: null },
    calculation: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
    adminCompanyId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Driver || mongoose.model("Driver", driverSchema);
