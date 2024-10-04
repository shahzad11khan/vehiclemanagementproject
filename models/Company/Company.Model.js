import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const CompanySchema = new mongoose.Schema(
  {
    CompanyName: {
      type: String,
      //   required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      //   required: true,
      unique: true,
    },
    password: {
      type: String,
      //   required: true,
    },
    confirmPassword: {
      type: String,
      //   required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    CreatedBy: {
      type: String,
    },
    CompanyRegistrationNumber: {
      type: String,
    },
    vatnumber: {
      type: String,
    },
    image: { type: String }, // URL to Cloudinary or local storage
    // Cloudinary public ID
    imagePublicId: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);
export default Company;
