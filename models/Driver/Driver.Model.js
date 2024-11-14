// models/Driver.Model.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: String },
    tel1: { type: String },
    tel2: { type: String, default: "" },
    email: { type: String },
    licenseNumber: { type: String, default: "" },
    niNumber: { type: String, default: "" },
    driverNumber: { type: String, default: "" },
    taxiFirm: { type: String, default: "" },
    badgeType: { type: String, default: "" },
    insurance: { type: String, default: "" },
    startDate: { type: String },
    driverRent: { type: Number, default: 0 },
    vehicle: { type: String },
    LocalAuth: { type: String },
    licenseExpiryDate: { type: String },
    taxiBadgeDate: { type: String },
    rentPaymentCycle: { type: String, default: "" },
    city: { type: String, default: "" },
    pay: { type: Number, default: 0 },
    county: { type: String, default: "" },
    postcode: { type: String, default: "" },
    postalAddress: { type: String, default: "" },
    // permanentAddress: { type: String, default: "" },
    imageFile: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    imageName: { type: String, default: "" },
    calculation: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
    adminCompanyId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Driver || mongoose.model("Driver", driverSchema);
