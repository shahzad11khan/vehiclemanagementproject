// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    tel1: { type: Number, default: "" },
    tel2: { type: Number, default: "" },
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
    passwordExpires: { type: Date, default: null }, // Use Date type for date fields
    passwordExpires: { type: Date, default: null }, // Use Date type for date fields
    // passwordExpiresEvery: { type: Number, default: null }, // Assuming this is a numeric value
    companyname: { type: String, default: "", trim: true }, // Set a default or handle appropriately
    CreatedBy: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"], // Restrict to specific roles
      default: "user", // Default role
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create a model from the schema
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
