"use client";
import React, { useState, useEffect } from "react";
import { API_URL_Company } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateCompanyModel = ({
  isOpen,
  onClose,
  fetchData,
  existingCompanyId,
}) => {
  const [formData, setFormData] = useState({
    CompanyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isActive: false,
    CreatedBy: "",
    CompanyRegistrationNumber: "",
    vatnumber: "",

    mailingAddress: "",
    physical_Address: "",
    phoneNumber: "",
    fax_Number: "",
    generalEmail: "",
    accountsPayableEmail: "",
    specificContactEmail: "",
    accountsPayableContactName: "",
    accountsPayableContactPhoneNumberandEmail: "",
    billingAddress: "",
    paymentTermsAgreedPaymentSchedule: "",
    paymentTermsPreferredPaymentMethod: "",
    bankingInformationBankName: "",
    bankingInformationBankAccountNumber: "",
    bankingInformationBankIBANSWIFTCode: "",
    bankingInformationBankAddress: "",
    specificDepartmentContactInformationBillingFinanceDepartment: "",
    specificDepartmentContactInformationProcurementPurchasingContact: "",
    specificDepartmentContactInformationPrimaryContactfortheProject: "",

    image: null,
  });

  // Fetch company details when the modal opens
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (existingCompanyId) {
        try {
          const response = await axios.get(
            `${API_URL_Company}/${existingCompanyId}`
          );
          const company = response.data.result; // Access the company data from response.data
          console.log(company);

          setFormData({
            CompanyName: company.CompanyName || "",
            email: company.email || "",
            password: company.confirmPassword, // Do not populate password fields for security reasons
            confirmPassword: company.confirmPassword, // Do not populate confirm password
            CompanyRegistrationNumber: company.CompanyRegistrationNumber, // Do not populate confirm password
            vatnumber: company.vatnumber, // Do not populate confirm password
            isActive: company.isActive || false,
            CreatedBy: company.CreatedBy || "",
            // New fields
            mailingAddress: company.mailingAddress || "",
            physical_Address: company.physical_Address || "",
            phoneNumber: company.phoneNumber || "",
            fax_Number: company.fax_Number || "",
            generalEmail: company.generalEmail || "",
            accountsPayableEmail: company.accountsPayableEmail || "",
            specificContactEmail: company.specificContactEmail || "",
            accountsPayableContactName:
              company.accountsPayableContactName || "",
            accountsPayableContactPhoneNumberandEmail:
              company.accountsPayableContactPhoneNumberandEmail || "",
            billingAddress: company.billingAddress || "",
            paymentTermsAgreedPaymentSchedule:
              company.paymentTermsAgreedPaymentSchedule || "",
            paymentTermsPreferredPaymentMethod:
              company.paymentTermsPreferredPaymentMethod || "",
            bankingInformationBankName:
              company.bankingInformationBankName || "",
            bankingInformationBankAccountNumber:
              company.bankingInformationBankAccountNumber || "",
            bankingInformationBankIBANSWIFTCode:
              company.bankingInformationBankIBANSWIFTCode || "",
            bankingInformationBankAddress:
              company.bankingInformationBankAddress || "",
            specificDepartmentContactInformationBillingFinanceDepartment:
              company.specificDepartmentContactInformationBillingFinanceDepartment ||
              "",
            specificDepartmentContactInformationProcurementPurchasingContact:
              company.specificDepartmentContactInformationProcurementPurchasingContact ||
              "",
            specificDepartmentContactInformationPrimaryContactfortheProject:
              company.specificDepartmentContactInformationPrimaryContactfortheProject ||
              "",
            image: null, // Image should be handled separately if required
          });
        } catch (error) {
          console.error("Error fetching company details:", error);
          toast.error("Error fetching company details");
        }
      }
    };

    if (isOpen && existingCompanyId) {
      fetchCompanyDetails();
    }
  }, [existingCompanyId, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.warn("Passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("CompanyName", formData.CompanyName);
    data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append(
      "CompanyRegistrationNumber",
      formData.CompanyRegistrationNumber
    );
    data.append("vatnumber", formData.vatnumber);
    data.append("isActive", formData.isActive);
    data.append("CreatedBy", formData.CreatedBy || "");
    //
    data.append("mailingAddress", formData.mailingAddress);
    data.append("physical_Address", formData.physical_Address);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("fax_Number", formData.fax_Number);
    data.append("generalEmail", formData.generalEmail);
    data.append("accountsPayableEmail", formData.accountsPayableEmail);
    data.append("specificContactEmail", formData.specificContactEmail);
    data.append(
      "accountsPayableContactName",
      formData.accountsPayableContactName
    );
    data.append(
      "accountsPayableContactPhoneNumberandEmail",
      formData.accountsPayableContactPhoneNumberandEmail
    );
    data.append("billingAddress", formData.billingAddress);
    data.append(
      "paymentTermsAgreedPaymentSchedule",
      formData.paymentTermsAgreedPaymentSchedule
    );
    data.append(
      "paymentTermsPreferredPaymentMethod",
      formData.paymentTermsPreferredPaymentMethod
    );
    data.append(
      "bankingInformationBankName",
      formData.bankingInformationBankName
    );
    data.append(
      "bankingInformationBankAccountNumber",
      formData.bankingInformationBankAccountNumber
    );
    data.append(
      "bankingInformationBankIBANSWIFTCode",
      formData.bankingInformationBankIBANSWIFTCode
    );
    data.append(
      "bankingInformationBankAddress",
      formData.bankingInformationBankAddress
    );
    data.append(
      "specificDepartmentContactInformationBillingFinanceDepartment",
      formData.specificDepartmentContactInformationBillingFinanceDepartment
    );
    data.append(
      "specificDepartmentContactInformationProcurementPurchasingContact",
      formData.specificDepartmentContactInformationProcurementPurchasingContact
    );
    data.append(
      "specificDepartmentContactInformationPrimaryContactfortheProject",
      formData.specificDepartmentContactInformationPrimaryContactfortheProject
    );
    //
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await axios.put(
        `${API_URL_Company}/${existingCompanyId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
        onClose();
      } else {
        toast.success(response.data.error);
      }
    } catch (error) {
      console.error("Error updating company details:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl  overflow-y-auto h-screen">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Register Company
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
            {/* Company Name */}
            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="CompanyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name
                </label>
                <span className="text-red-600">*</span>
              </div>

              <input
                type="text"
                id="CompanyName"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <span className="text-red-600">*</span>
              </div>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <span className="text-red-600">*</span>
              </div>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* CompanyRegistrationNumber*/}
            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="CompanyRegistrationNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Registration Number
                </label>
              </div>

              <input
                type="text"
                id="CompanyRegistrationNumber"
                name="CompanyRegistrationNumber"
                value={formData.CompanyRegistrationNumber}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* vatnumber*/}
            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="vatnumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vat Number
                </label>
              </div>

              <input
                type="text"
                id="vatnumber"
                name="vatnumber"
                value={formData.vatnumber}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {/* contect info */}
          <div>
            <h2 className="text-xl font-semibold mb-8">Contact Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
              <div className="flex flex-col">
                {/* millinf info */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="CompanyName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mailing Address
                    </label>
                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="mailingAddress"
                    name="mailingAddress"
                    value={formData.mailingAddress}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              {/*     physical_Address: "", info */}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="physical_Address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Physical Address
                  </label>
                  <span className="text-red-600">*</span>
                </div>
                <input
                  type="text"
                  id="physical_Address"
                  name="physical_Address"
                  value={formData.physical_Address}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {/*     phoneNumber: "", info */}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <span className="text-red-600">*</span>
                </div>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/*     generalEmail :*/}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="generalEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    General Email
                  </label>
                </div>
                <input
                  type="email"
                  id="generalEmail"
                  name="generalEmail"
                  value={formData.generalEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/*     accountsPayableEmail :*/}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="accountsPayableEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Accounts Payable Email
                  </label>
                </div>
                <input
                  type="email"
                  id="accountsPayableEmail"
                  name="accountsPayableEmail"
                  value={formData.accountsPayableEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/*     specificContactEmail :*/}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="specificContactEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specific Contact Email
                  </label>
                  <span className="text-red-600">*</span>
                </div>
                <input
                  type="email"
                  id="specificContactEmail"
                  name="specificContactEmail"
                  value={formData.specificContactEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          {/* Billing and Invoicing Information */}
          <div>
            <h2 className="text-xl font-semibold mb-8">
              Billing and Invoicing Information
            </h2>

            {/*  Accounts Payable Contact: */}
            <div className="">
              <h2 className="text-xl font-semibold mb-8">
                Accounts Payable Contact:
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="accountsPayableContactName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    id="accountsPayableContactName"
                    name="accountsPayableContactName"
                    value={formData.accountsPayableContactName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     Phone Number and Email */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="accountsPayableContactPhoneNumberandEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number and Email
                    </label>
                  </div>
                  <input
                    type="text"
                    id="accountsPayableContactPhoneNumberandEmail"
                    name="accountsPayableContactPhoneNumberandEmail"
                    value={formData.accountsPayableContactPhoneNumberandEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/*     Billing Address: "", info */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="billingAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Billing Address
                    </label>
                  </div>
                  <input
                    type="text"
                    id="billingAddress"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     Agreed Payment Schedule:*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="paymentTermsAgreedPaymentSchedule"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Agreed Payment Schedule
                    </label>
                  </div>
                  <select
                    id="paymentTermsAgreedPaymentSchedule"
                    name="paymentTermsAgreedPaymentSchedule"
                    value={formData.paymentTermsAgreedPaymentSchedule}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Payment Schedule</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="120">120 days</option>
                    <option value="150">150 days</option>
                  </select>
                </div>
                {/*     Preferred Payment Method :*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="paymentTermsPreferredPaymentMethod"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Preferred Payment Method
                    </label>
                  </div>
                  <select
                    id="paymentTermsPreferredPaymentMethod"
                    name="paymentTermsPreferredPaymentMethod"
                    value={formData.paymentTermsPreferredPaymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Bank A">Bank A</option>
                    <option value="Bank B">Bank B</option>
                    <option value="Bank C">Bank C</option>
                    <option value="Bank D">Bank D</option>
                    <option value="Bank E">Bank E</option>
                    {/* Add more banks as needed */}
                  </select>
                </div>
              </div>
            </div>
            {/* Banking Information */}
            <div className="">
              <h2 className="text-xl font-semibold mb-8">
                Banking Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Bank Name*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="bankingInformationBankName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bank Name
                    </label>
                  </div>
                  <input
                    type="text"
                    id="bankingInformationBankName"
                    name="bankingInformationBankName"
                    value={formData.bankingInformationBankName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     Bank Account Number*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="bankingInformationBankAccountNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bank Account Number
                    </label>
                  </div>
                  <input
                    type="text"
                    id="bankingInformationBankAccountNumber"
                    name="bankingInformationBankAccountNumber"
                    value={formData.bankingInformationBankAccountNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/*     IBAN/SWIFT Code */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="bankingInformationBankIBANSWIFTCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      IBAN / SWIFT Code
                    </label>
                  </div>
                  <input
                    type="text"
                    id="bankingInformationBankIBANSWIFTCode"
                    name="bankingInformationBankIBANSWIFTCode"
                    value={formData.bankingInformationBankIBANSWIFTCode}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     Bank Address*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="bankingInformationBankAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bank Address
                    </label>
                  </div>
                  <input
                    type="text"
                    id="bankingInformationBankAddress"
                    name="bankingInformationBankAddress"
                    value={formData.bankingInformationBankAddress}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            {/* Specific Department Contact Information*/}
            <div className="">
              <h2 className="text-xl font-semibold mb-8">
                Specific Department Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Billing/Finance Department*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationBillingFinanceDepartment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Billing / Finance Department
                    </label>
                  </div>
                  <input
                    type="text"
                    id="specificDepartmentContactInformationBillingFinanceDepartment"
                    name="specificDepartmentContactInformationBillingFinanceDepartment"
                    value={
                      formData.specificDepartmentContactInformationBillingFinanceDepartment
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     Procurement/Purchasing Contact*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationProcurementPurchasingContact"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Procurement/Purchasing Contact
                    </label>
                  </div>
                  <input
                    type="text"
                    id="specificDepartmentContactInformationProcurementPurchasingContact"
                    name="specificDepartmentContactInformationProcurementPurchasingContact"
                    value={
                      formData.specificDepartmentContactInformationProcurementPurchasingContact
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/*     Primary Contact for the Project*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationPrimaryContactfortheProject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Primary Contact for the Project
                    </label>
                  </div>
                  <input
                    type="text"
                    id="specificDepartmentContactInformationPrimaryContactfortheProject"
                    name="specificDepartmentContactInformationPrimaryContactfortheProject"
                    value={
                      formData.specificDepartmentContactInformationPrimaryContactfortheProject
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* IsActive Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Is Active
            </label>
          </div>

          {/* Upload Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Button Group */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCompanyModel;
