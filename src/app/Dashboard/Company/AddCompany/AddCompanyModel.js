"use client";
import React, { useState } from "react";
import { API_URL_Company } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


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

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [validation, setValidation] = useState({
    emailValid: false,
    passwordMatch: false,
    passwordValid: false,
  });

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;
  //   const updatedValue = type === 'checkbox' ? checked : value;

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: updatedValue,
  //   }));
  //   if (name === 'email') {
  //     setValidation((prevValidation) => ({
  //       ...prevValidation,
  //       emailValid: emailRegex.test(updatedValue),
  //     }));
  //   }
  //   if (name === 'password' || name === 'confirmPassword') {
  //     const password = name === 'password' ? updatedValue : formData.password;
  //     const confirmPassword =
  //       name === 'confirmPassword' ? updatedValue : formData.confirmPassword;
  //       setValidation((prevValidation) => ({
  //       ...prevValidation,
  //       passwordValid: strongPasswordRegex.test(password), // Validate password with regex
  //       passwordMatch: password === confirmPassword, // Check if passwords match
  //     }));
  //   }
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]:
  //       type === "checkbox" ? checked : type === "file" ? files[0] : value,
  //     ...(name === "mailingAddress" && autoFillAll
  //       ? {
  //           billingAddress: value,
  //           bankingInformationBankAddress: value,
  //           physical_Address: value,
  //         }
  //       : {}),
  //   }));
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

  console.log(handleCheckboxChange)
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto ">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Register Company
          </h2>

          <img src="/crossIcon.svg" onClick={() => {
            onClose();
            setStep(1);
          }} />

        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          encType="multipart/form-data"
        >
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 ">
                {/* Company Name */}
                <div>
                  <div className="flex gap-1 items-center justify-start">
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
                    className="block w-full p-2 mt-1 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Company name"
                  />
                </div>

                {/* CompanyRegistrationNumber*/}
                <div>
                  <div className="flex gap-1 ">
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
                    placeholder="Company Registration Number"
                    className=" block w-full p-2 border mt-1 border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

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
                    placeholder="VAT number"
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <div className="flex gap-1 items-center justify-start">
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
                    placeholder="Email"
                    // className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    className={`mt-1 block w-full p-2 border rounded-[4px] ${validation.emailValid === null
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

                {/* Password */}
                {/* <div className="flex gap-2 bg-red-300"> */}
                <div className="relative">
                  <div className="flex gap-1 items-center justify-start">
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
                    placeholder="Password"
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

                {/* Confirm Password */}
                <div>
                  <div className="flex gap-1 items-center justify-start">
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
                        ? "border-[#42506666]"
                        : validation.passwordMatch
                          ? "border-green-700"
                          : "border-red-700"
                        } focus:outline-none border border-[#42506666] rounded-[4px]`}
                      required
                      placeholder="Confirm password"
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

                  <p
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
                  </p>
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {/* </div> */}

                {/* <button
                  type="button"
                  className="border-2 h-10 mt-6 p-2 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button> */}
              </div>

              <h2 className="font-bold">Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/*  Building and Street (Line 1of 2) */}
                <div>
                  <div className="flex gap-1 items-center justify-start">
                    <label
                      htmlFor="Building&Street"
                      className="text-[10px] "
                    >
                      Building and Street (Line 1of 2)
                    </label>
                  </div>

                  <input
                    type="text"
                    id="Building&Street"
                    name="Building&Street"
                    // value={formData.CompanyName}
                    // onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Building and street"
                  />
                </div>

                {/*  Building and Street (Line 2of 2) */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="Building&Street2"
                      className="text-[10px] "
                    >
                      Building and Street (Line 2 of 2)
                    </label>
                  </div>

                  <input
                    type="text"
                    id="Building&Street2"
                    name="Building&Street2"
                    // value={formData.CompanyName}
                    // onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Building and street"
                  />
                </div>

                {/*  Town/City */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="CompanyName"
                      className="text-[10px] "
                    >
                      Town/City
                    </label>
                  </div>

                  <input
                    type="text"
                    id="Building&Street"
                    name="Building&Street"
                    // value={formData.CompanyName}
                    // onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Town/City"
                  />
                </div>

                {/* Country */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="CompanyName"
                      className="text-[10px] "
                    >
                      Country
                    </label>
                  </div>

                  <input
                    type="text"
                    id="Building&Street"
                    name="Building&Street"
                    // value={formData.CompanyName}
                    // onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Country"
                  />
                </div>

                {/* Postcode */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="CompanyName"
                      className="text-[10px] "
                    >
                      Postcode
                    </label>
                  </div>

                  <input
                    type="text"
                    id="Building&Street"
                    name="Building&Street"
                    // value={formData.CompanyName}
                    // onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Postcode"
                  />
                </div>

                {/* <button
                  type="button"
                  className="border-2 h-10 mt-6 p-2 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button> */}



              </div>

              <div className="flex gap-[10px] justify-end">
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
                </button>
              </div>
            </>
          )}
          {/* contect info */}

          {/* {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 ">
                <div className="flex flex-col">
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="CompanyName"
                        className="block text-sm font-medium "
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
                    <span className="ml-2 text-sm ">
                      Same as Mailing Address for all addresses
                    </span>
                  </label>
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="physical_Address"
                      className="block text-sm font-medium "
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

             
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="generalEmail"
                      className="block text-sm font-medium "
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
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="accountsPayableEmail"
                      className="block text-sm font-medium "
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
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificContactEmail"
                      className="block text-sm font-medium "
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
          )} */}

          {/* Billing and Invoicing Information */}
          {step === 2 && (
            <>

              {/*  Accounts Payable Contact: */}
              <div className="">
                <h2 className="font-bold">
                  Accounts Payable Contact:
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
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
                      placeholder="Name"
                    />
                  </div>
                  {/*     Phone Number and Email */}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="accountsPayableContactPhoneNumberandEmail"
                        className="text-[10px] "
                      >
                        Phone number
                      </label>
                    </div>
                    <input
                      type="text"
                      id="accountsPayableContactPhoneNumberandEmail"
                      name="accountsPayableContactPhoneNumberandEmail"
                      value={formData.accountsPayableContactPhoneNumberandEmail}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Phone number "
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="accountsPayableContactPhoneNumberandEmail"
                        className="text-[10px] "
                      >
                        Email
                      </label>
                    </div>
                    <input
                      type="email"
                      id="accountsPayableContactPhoneNumberandEmail"
                      name="accountsPayableContactPhoneNumberandEmail"
                      // value={formData.accountsPayableContactPhoneNumberandEmail}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email"
                    />
                  </div>
                  {/* </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> */}
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
                      placeholder="Billing Address"
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
                      <option value="">Select</option>
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
                      <option value="">Select</option>
                      <option value="Bank A">Bank A</option>
                      <option value="Bank B">Bank B</option>
                      <option value="Bank C">Bank C</option>
                      <option value="Bank D">Bank D</option>
                      <option value="Bank E">Bank E</option>
                      {/* Add more banks as needed */}
                    </select>
                  </div>
                </div>

                <h2 className="font-bold mt-4">
                  Banking Information
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-2  gap-x-6 gap-y-4 mt-1">
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
                      placeholder="Bank name"
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
                      placeholder="Bank account number"
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
                      placeholder="IBAN / SWIFT Code"
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
                      placeholder="Bank address"
                    />
                  </div>
                </div>

                <h2 className="font-bold  mt-4">Specific Department Contact Information</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2  gap-x-6 gap-y-4 mt-1">
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
                      placeholder="Billing / Finance Department"
                    />
                  </div>
                  {/*     Procurement/Purchasing Contact*/}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="specificDepartmentContactInformationProcurementPurchasingContact"
                        className="text-[10px] "
                      >
                        Procurement / Purchasing Contact
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
                      placeholder="Procurement / Purchasing Contact"
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
                      placeholder="Primary Contact for the Project"
                    />
                  </div>

                  <div>
                    <label className="text-[10px]">Status</label>
                    <div className="flex gap-6 p-2">
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
                          className="accent-green-700"
                        />
                        <span className="text-xs">Active</span>
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
                          className="accent-black"
                        />
                        <span className="text-xs">Inactive</span>
                      </label>
                    </div>
                  </div>

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
                </div>




              </div>
              {/* Banking Information */}

              <div className="mt-6 flex  justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-1 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>

                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setStep(1);
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Close
                  </button>


                  <button
                    type="submit"
                    className="px-6 py-2 bg-custom-bg text-white text-xs font-bold rounded-[4px] hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>


            </>
          )}
          {/* {step === 3 && (
            <>



              <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
           
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationBillingFinanceDepartment"
                      className="block text-sm font-medium "
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
               
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationProcurementPurchasingContact"
                      className="block text-sm font-medium "
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

              
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="specificDepartmentContactInformationPrimaryContactfortheProject"
                      className="block text-sm font-medium "
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
          )} */}
          {/* Specific Department Contact Information*/}
          {/* {step === 3 && ( */}
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
              className="ml-2 block text-sm font-medium "
            >
              Is Active
            </label>
          </div> */}




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
                  Register
                </button>
              </div> */}
          </>
          {/* )} */}
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModel;
