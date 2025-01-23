import mongoose from "mongoose";

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
      validate: {
        validator: function (value) {
          // Regex pattern explanation:
          // ^              : Start of string
          // [A-Z]          : First character must be an uppercase letter
          // \d{2}          : Followed by exactly two digits
          // .*[\W_].*      : Must include at least one special character
          // .{5,}          : Minimum length of 5 characters
          // $              : End of string
          return /^(?=.*[\W_])[A-Z]\d{2}.{2,}$/.test(value);
        },
        message:
          "Password must start with an uppercase letter, followed by two digits, and include at least one special character.",
      },
    },
    confirmPassword: {
      type: String,
      //   required: true,
      validate: {
        validator: function (value) {
          // Regex pattern explanation:
          // ^              : Start of string
          // [A-Z]          : First character must be an uppercase letter
          // \d{2}          : Followed by exactly two digits
          // .*[\W_].*      : Must include at least one special character
          // .{5,}          : Minimum length of 5 characters
          // $              : End of string
          return /^(?=.*[\W_])[A-Z]\d{2}.{2,}$/.test(value);
        },
        message:
          "Password must start with an uppercase letter, followed by two digits, and include at least one special character.",
      },
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

    mailingAddress: { type: String },
    physical_Address: { type: String },
    phoneNumber: { type: String },
    generalEmail: { type: String },
    accountsPayableEmail: { type: String },
    specificContactEmail: { type: String },
    accountsPayableContactName: { type: String },
    accountsPayableContactPhoneNumberandEmail: { type: String },
    billingAddress: { type: String },
    paymentTermsAgreedPaymentSchedule: { type: String },
    paymentTermsPreferredPaymentMethod: { type: String },
    bankingInformationBankName: { type: String },
    bankingInformationBankAccountNumber: { type: String },
    bankingInformationBankIBANSWIFTCode: { type: String },
    bankingInformationBankAddress: { type: String },
    specificDepartmentContactInformationBillingFinanceDepartment: {
      type: String,
    },
    specificDepartmentContactInformationProcurementPurchasingContact: {
      type: String,
    },
    specificDepartmentContactInformationPrimaryContactfortheProject: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);
export default Company;
