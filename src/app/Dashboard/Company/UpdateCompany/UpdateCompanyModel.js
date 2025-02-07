"use client";
import React, { useState, useEffect } from "react";
import { API_URL_Company } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


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
  const [autoFillAll, setAutoFillAll] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [showPassword, setShowPassword] = useState(false);
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [validation, setValidation] = useState({
    emailValid: false,
    passwordMatch: false,
    passwordValid: false,
  });

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
            image: company.image, // Image should be handled separately if required
          });
          setImagePreview(company.image);
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

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]:
  //       type === "checkbox" ? checked : type === "file" ? files[0] : value,
  //     ...(name === "mailingAddress" && autoFillAll
  //       ? {
  //           billingAddress: value,
  //           bankingInformationBankAddress: value,
  //           physical_Address: value,
  //         }
  //       : {}),
  //   });
  // };
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const updatedValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
      ...(name === 'mailingAddress' && autoFillAll
        ? {
          billingAddress: value,
          bankingInformationBankAddress: value,
          physical_Address: value,
        }
        : {}),
    }));

    // Validation logic
    if (name === 'email') {
      setValidation((prevValidation) => ({
        ...prevValidation,
        emailValid: emailRegex.test(updatedValue),
      }));
    }

    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? updatedValue : formData.password;
      const confirmPassword = name === 'confirmPassword' ? updatedValue : formData.confirmPassword;

      setValidation((prevValidation) => ({
        ...prevValidation,
        passwordValid: strongPasswordRegex.test(password), // Validate password strength
        passwordMatch: password === confirmPassword, // Check if passwords match
      }));
    }
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
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl  overflow-y-auto">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">
          Update Company
        </h2> */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Update Company
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
            setStep(1);
          }} />

        </div>

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
                      className="text-[10px] "
                    >
                      Company Name <span className="text-red-600">*</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    id="CompanyName"
                    name="CompanyName"
                    value={formData.CompanyName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="email"
                      className="text-[10px] "
                    >
                      Email <span className="text-red-600">*</span>
                    </label>
                  </div>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full p-2 border  rounded-[4px]  ${validation.emailValid === null
                      ? 'border-[#42506666]'
                      : validation.emailValid
                        ? 'border-green-700'
                        : 'border-red-700'
                      } focus:outline-none`}
                    required
                  />
                  {validation.emailValid === false && (
                    <p className="text-[8px] text-red-700">Invalid email format</p>
                  )}
                  {validation.emailValid === true && (
                    <p className="text-[8px] text-green-700">Valid email format</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {/* Password */}
                  <div className="relative">
                    <div className="flex gap-1">
                      {/* <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <span className="text-red-600">*</span> */}
                      <label
                        htmlFor="password"
                        className="text-[10px] "
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 pr-10 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/3"
                    >
                      {showPassword ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>
                  {/* Confirm Password */}
                  <div>
                    <div className="flex gap-1">
                      {/* <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <span className="text-red-600">*</span> */}
                      <label
                        htmlFor="confirmPassword"
                        className="text-[10px] "
                      >
                        Confirm Password <span className="text-red-600">*</span>
                      </label>

                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`mt-1 block w-full p-2 pr-10 ${validation.passwordMatch === null
                          ? "border-gray-300"
                          : validation.passwordMatch
                            ? "border-green-500"
                            : "border-red-500"
                          } focus:outline-none border border-[#42506666] rounded-[4px]`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                      >
                        {showPassword ? (
                          <AiOutlineEye size={20} />
                        ) : (
                          <AiOutlineEyeInvisible size={20} />
                        )}
                      </button>
                    </div>

                    <span
                      className={`text-[8px] ${validation.passwordMatch === null
                        ? "text-gray-500"
                        : validation.passwordMatch
                          ? strongPasswordRegex.test(formData.password)
                            ? "text-green-700"
                            : "text-red-700"
                          : "text-red-700"
                        }`}
                    >
                      {validation.passwordMatch === null
                        ? "Confirm Password must be entered i.e Abc@1234"
                        : !validation.passwordMatch
                          ? "Confirm Password does not match i.e Abc@1234"
                          : !strongPasswordRegex.test(formData.password)
                            ? "Password is not strong i.e Abc@1234"
                            : "Confirm Password matched"}
                    </span>
                  </div>
                </div>
                {/* CompanyRegistrationNumber*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="CompanyRegistrationNumber"
                      className="text-[10px] "
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* <button
                  type="button"
                  className="border-2 h-10 mt-6 p-2 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button> */}
                {/* vatnumber*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="vatnumber"
                      className="text-[10px] "
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-custom-bg text-white text-xs font-bold rounded-[4px] hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
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
                        className="text-[10px] "
                      >
                        Mailing Address <span className="text-red-600">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      id="mailingAddress"
                      name="mailingAddress"
                      value={formData.mailingAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={autoFillAll}
                      onChange={handleCheckboxChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2 text-[10px] text-gray-700">
                      Same as Mailing Address for all addresses
                    </span>
                  </label>
                </div>
                {/*     physical_Address: "", info */}
                <div>
                  <div className="flex gap-1">
                    {/* <label
                      htmlFor="physical_Address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Physical Address
                    </label>
                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="physical_Address"
                      className="text-[10px] "
                    >
                      Physical Address <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="physical_Address"
                    name="physical_Address"
                    value={formData.physical_Address}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {/*     phoneNumber: "", info */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="phoneNumber"
                      className="text-[10px] "
                    >
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/*     generalEmail :*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="generalEmail"
                      className="text-[10px] "
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     accountsPayableEmail :*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="accountsPayableEmail"
                      className="text-[10px] "
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     specificContactEmail :*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificContactEmail"
                      className="text-[10px] "
                    >
                      Specific Contact Email<span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="email"
                    id="specificContactEmail"
                    name="specificContactEmail"
                    value={formData.specificContactEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]  shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-between">
                <div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Back
                  </button>
                </div>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setStep(1);
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-custom-bg text-white text-xs font-bold rounded-[4px] hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Next
                  </button></div>
              </div>
            </>
          )}
          {/* Billing and Invoicing Information */}
          {step === 3 && (
            <>
              {/* <h2 className="text-md font-semibold">
                Billing and Invoicing Information
              </h2> */}

              {/*  Accounts Payable Contact: */}
              <div className="">
                <h2 className="text-xl font-semibold">
                  Accounts Payable Contact:
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  {/* Name*/}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="accountsPayableContactName"
                        className="text-[10px] "
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/*     Phone Number and Email */}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="accountsPayableContactPhoneNumberandEmail"
                        className="text-[10px] "
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/*     Billing Address: "", info */}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="billingAddress"
                        className="text-[10px] "
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/*     Agreed Payment Schedule:*/}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="paymentTermsAgreedPaymentSchedule"
                        className="text-[10px] "
                      >
                        Agreed Payment Schedule
                      </label>
                    </div>
                    <select
                      id="paymentTermsAgreedPaymentSchedule"
                      name="paymentTermsAgreedPaymentSchedule"
                      value={formData.paymentTermsAgreedPaymentSchedule}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                        className="text-[10px] "
                      >
                        Preferred Payment Method
                      </label>
                    </div>
                    <select
                      id="paymentTermsPreferredPaymentMethod"
                      name="paymentTermsPreferredPaymentMethod"
                      value={formData.paymentTermsPreferredPaymentMethod}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

              {/* <div className="mt-6 flex gap-2 justify-end">
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
              </div> */}
              <div className="mt-6 flex gap-2 justify-between">
                <div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Back
                  </button>
                </div>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setStep(1);
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-custom-bg text-white text-xs font-bold rounded-[4px] hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Next
                  </button></div>
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
                        className="text-[10px] "
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/*     Bank Account Number*/}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="bankingInformationBankAccountNumber"
                        className="text-[10px] "
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/*     IBAN/SWIFT Code */}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="bankingInformationBankIBANSWIFTCode"
                        className="text-[10px] "
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/*     Bank Address*/}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="bankingInformationBankAddress"
                        className="text-[10px] "
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <h2 className="text-lg font-semibold mb-5">
                Specific Department Contact Information
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
                {/* Billing/Finance Department*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationBillingFinanceDepartment"
                      className="text-[10px] "
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/*     Procurement/Purchasing Contact*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationProcurementPurchasingContact"
                      className="text-[10px] "
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/*     Primary Contact for the Project*/}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationPrimaryContactfortheProject"
                      className="text-[10px] "
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-between">
                <div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Back
                  </button>
                </div>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setStep(1);
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-custom-bg text-white text-xs font-bold rounded-[4px] hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Next
                  </button></div>
              </div>
            </>
          )}

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
          {step === 5 && (
            <>
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
              {/* <div>
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
              </div> */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="image"
                  className="text-[10px]"
                >
                  Upload Image:
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                />
              </div>
              <div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={imagePreview || "No Image"}
                    className="h-28 w-28"
                  />
                )}
              </div>

              {/* Button Group */}
              {/* <div className="flex justify-end gap-4">
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
                  Update
                </button>
              </div> */}
              <div className="mt-6 flex gap-2 justify-between">
                <div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Back
                  </button>
                </div>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setStep(1);
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-custom-bg text-white text-xs font-bold rounded-[4px] hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Next
                  </button></div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateCompanyModel;
