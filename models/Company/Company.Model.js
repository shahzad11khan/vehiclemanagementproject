import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const CompanySchema = new mongoose.Schema(
  {
    CompanyName: {
      type: String,
      //   required: true,
      unique: true,
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
    image: { type: String }, // URL to Cloudinary or local storage
    // Cloudinary public ID
    imagePublicId: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Password hashing before saving
CompanySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);
export default Company;