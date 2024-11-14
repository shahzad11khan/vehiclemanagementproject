// models/EnquiryModel.js
import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unqiue: true,
    },
    tel1: {
      type: String,
    },
    tel2: {
      type: String,
      default: "",
    },
    postcode: {
      type: String,
      default: "",
    },
    postalAddress: {
      type: String,
      default: "",
    },
    permanentAddress: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    county: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    niNumber: {
      type: String,
      default: "",
    },
    badgeType: {
      type: String,
      default: "",
    },
    localAuthority: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    adminCreatedBy: { type: String },
    adminCompanyName: { type: String },
    adminCompanyId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Enquiry =
  mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
export default Enquiry;
