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
