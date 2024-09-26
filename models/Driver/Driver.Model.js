// models/Driver.Model.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, default: new Date().toISOString() },
    tel1: { type: String, required: true },
    tel2: { type: String, default: null },
    email: { type: String, required: true },
    licenseNumber: { type: String, default: null },
    niNumber: { type: String, default: null },
    driverNumber: { type: String, default: null },
    taxiFirm: { type: String, default: null },
    badgeType: { type: String, default: null },
    insurance: { type: String, default: null },
    startDate: { type: Date, default: new Date().toISOString() },
    driverRent: { type: Number, default: null },
    licenseExpiryDate: { type: Date, default: new Date().toISOString() },
    taxiBadgeDate: { type: Date, default: new Date().toISOString() },
    rentPaymentCycle: { type: String, default: null },
    city: { type: String, default: null },
    county: { type: String, default: null },
    postcode: { type: String, default: null },
    postalAddress: { type: String, default: null },
    permanentAddress: { type: String, default: null },
    imageUrl: { type: String, default: null },
    imagePublicId: { type: String, default: null },
    imageName: { type: String, default: null },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Driver || mongoose.model("Driver", driverSchema);
