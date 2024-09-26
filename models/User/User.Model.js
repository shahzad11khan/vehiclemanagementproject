import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
    companyname: { type: String, required: true },
    useravatar: { type: String },
    userPublicId: { type: String },
    companyavatar: { type: String },
    companyPublicId: { type: String },
    isActive: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["superadmin", "admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
