"use client";
import React, { useState } from "react";
import { API_URL_Company } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";

const AddCompanyModel = ({ isOpen, onClose, fetchData }) => {
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

  const [autoFillAll, setAutoFillAll] = useState(false);
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
      ...(name === "mailingAddress" && autoFillAll
        ? {
            billingAddress: value,
            bankingInformationBankAddress: value,
            physical_Address: value,
          }
        : {}),
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setAutoFillAll(checked);
    setFormData((prevData) => ({
      ...prevData,
      ...(checked
        ? {
            billingAddress: prevData.mailingAddress,
            bankingInformationBankAddress: prevData.mailingAddress,
            physical_Address: prevData.mailingAddress,
          }
        : {
            billingAddress: "",
            bankingInformationBankAddress: "",
            physical_Address: "",
          }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${API_URL_Company}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
        onClose();
      } else {
        toast.warn(response.data.error);
      }
    } catch (error) {
      console.error("Error uploading the data: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto ">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Register Company
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
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
                <div className="flex gap-2">
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
                      type={showPassword ? "text" : "password"}
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
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
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
                <button
                  type="button"
                  className="border-2 h-10 mt-6 p-2 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
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
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {/* contect info */}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 ">
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
                  <label className="inline-flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={autoFillAll}
                      onChange={handleCheckboxChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Same as Mailing Address for all addresses
                    </span>
                  </label>
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
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Billing and Invoicing Information */}
          {step === 3 && (
            <>
              <h2 className="text-md font-semibold">
                Billing and Invoicing Information
              </h2>

              {/*  Accounts Payable Contact: */}
              <div className="">
                <h2 className="text-xl font-semibold">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <div className="">
                <h2 className="text-xl font-semibold">Banking Information</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
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
              <h2 className="text-xl font-semibold mb-8">
                Specific Department Contact Information
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
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
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {/* Specific Department Contact Information*/}
          {step === 5 && (
            <>
              {/* IsActive Checkbox */}
              {/* <div className="flex items-center">
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
          </div> */}
              <div>
                <label className="block font-medium mb-2">Is Active:</label>
                <div className="flex gap-4">
                  {/* Yes Option */}
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={formData.isActive === true}
                      onChange={() =>
                        handleChange({
                          target: { name: "isActive", value: true },
                        })
                      }
                      className="accent-green-500"
                    />
                    <span>Active</span>
                  </label>

                  {/* No Option */}
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={formData.isActive === false}
                      onChange={() =>
                        handleChange({
                          target: { name: "isActive", value: false },
                        })
                      }
                      className="accent-red-500"
                    />
                    <span>InActive</span>
                  </label>
                </div>
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
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModel;
