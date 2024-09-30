import mongoose from "mongoose";

const FirmSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  companyNo: { type: String },
  vatNo: { type: String },
  insurancePolicyNo: { type: String },
  website: { type: String },
  email: { type: String },
  tel1: { type: String },
  tel2: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  postcode: { type: String },
  isActive: { type: Boolean, default: false },
  employmentLetter: { type: Boolean, default: false },
  coverLetter: { type: Boolean, default: false },
  signature: { type: String },
  imageName: { type: String },
  imageFile: { type: String },
  imagepublicId: { type: String },
  adminCreatedBy: { type: String },
  adminCompanyName: { type: String },
});

export const Firm = mongoose.models.Firm || mongoose.model("Firm", FirmSchema);
