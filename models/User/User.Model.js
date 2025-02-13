// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    tel1: { type: Number },
    tel2: { type: Number },
    postcode: { type: String, default: "" },
    postalAddress: { type: String, default: "" },
    permanentAddress: { type: String, default: "" },
    city: { type: String, default: "" },
    county: { type: String, default: "" },
    // accessLevel: { type: String, default: "" },
    dateOfBirth: { type: String, default: null }, // Use Date type for date fields
    position: { type: String, default: "" },
    reportsTo: { type: String, default: "" },
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    confirmpassword: { type: String, default: "" },
    useravatar: { type: String, default: "" },
    userPublicId: { type: String, default: "" },
    passwordExpires: { type: String, default: "" }, // Use Date type for date fields
    // passwordExpiresEvery: { type: Number, default: null }, // Assuming this is a numeric value
    companyName: { type: String, default: "", trim: true }, // Set a default or handle appropriately
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
    },
    companyId: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Company',
    },
    adminCompanyId: { type: String },
    CreatedBy: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"], // Restrict to specific roles
      default: "user", // Default role
    },
    Postcode: { type: String },
    BuildingAndStreetOne: { type: String },
    BuildingAndStreetTwo: { type: String },
    Town_City: { type: String },
    Country: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create a model from the schema
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
