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
    password: { type: String, default: "", validate: {
      validator: function (value) {
        // Regex pattern explanation:
        // ^                : Start of string
        // [A-Z]            : First character must be an uppercase letter
        // [\W_]            : Second character must be a special symbol (non-alphanumeric)
        // (?=(.*\d){3})     : Ensure there are at least 3 digits in the password
        // .{3,}            : Minimum length of 3 characters after special symbol
        // $                : End of string
        return /^[A-Z][\W_](?=(.*\d){3}).{3,}$/.test(value);
      },
      message:
        "Password must start with an uppercase letter, followed by a special symbol, and contain at least three digits.",
    }, },
    confirmpassword: { type: String, default: "",validate: {
      validator: function (value) {
        // Regex pattern explanation:
        // ^                : Start of string
        // [A-Z]            : First character must be an uppercase letter
        // [\W_]            : Second character must be a special symbol (non-alphanumeric)
        // (?=(.*\d){3})     : Ensure there are at least 3 digits in the password
        // .{3,}            : Minimum length of 3 characters after special symbol
        // $                : End of string
        return /^[A-Z][\W_](?=(.*\d){3}).{3,}$/.test(value);
      },
      message:
        "Password must start with an uppercase letter, followed by a special symbol, and contain at least three digits.",
    }, },
    useravatar: { type: String, default: "" },
    userPublicId: { type: String, default: "" },
    passwordExpires: { type: String, default: "" }, // Use Date type for date fields
    // passwordExpiresEvery: { type: Number, default: null }, // Assuming this is a numeric value
    companyname: { type: String, default: "", trim: true }, // Set a default or handle appropriately
    adminCompanyId: { type: String },
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
