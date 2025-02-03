"use client";
import React, { useEffect, useState } from "react";
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
// import { fetchTitle } from "../../Components/DropdownData/taxiFirm/taxiFirmService";
import { toast } from "react-toastify";
import {
  getCompanyName,
  getsuperadmincompanyname,
  // getUserRole,
} from "@/utils/storageUtils";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const AddUserModel = ({ isOpen, onClose, fetchData }) => {
  const [showPasswords, setShowPasswords] = useState(false);
  // const [dobvalidation, setdobValidation] = useState({ dateOfBirthValid: true });
  // const passwordRegex = /^[A-Z][@#$%^&*!]\d[a-z]{6,}$/;
  const passwordRegex = /^[A-Z][a-z]+[@#$%^&*!]\d[a-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [validation, setValidation] = useState({
    emailValid: false,
    passwordMatch: false,
    passwordValid: false,
    dateOfBirthValid: true,
    passwordExpiresvalid: false
  });

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    tel1: "",
    tel2: 0,
    postcode: "",
    postalAddress: "",
    permanentAddress: "",
    city: "",
    county: "",
    // accessLevel: "",
    dateOfBirth: "",
    position: "",
    reportsTo: "",
    username: "",
    password: "",
    passwordExpires: "",
    // passwordExpiresEvery: "",
    confirmpassword: "",
    companyname: "",
    CreatedBy: "",
    useravatar: null,
    isActive: false,
    role: "user", // Default role set to "user"
  });

  // Retrieve company name from local storage
  useEffect(() => {
    const storedCompanyName = getCompanyName() || getsuperadmincompanyname(); // Replace with the actual key used in localStorage
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        companyname: storedCompanyName,
      }));
    }


  }, []); // Run only once when the component mounts

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
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
  //   } else if (name === 'confirmpassword' || name === 'password') {
  //     const password = name === 'password' ? updatedValue : formData.password;
  //     const confirmPassword =
  //       name === 'confirmpassword' ? updatedValue : formData.confirmpassword;

  //     setValidation((prevValidation) => ({
  //       ...prevValidation,
  //       passwordMatch: password === confirmPassword,
  //     }));
  //   }
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    // Validation logic
    if (name === 'email') {
      setValidation((prevValidation) => ({
        ...prevValidation,
        emailValid: emailRegex.test(updatedValue),
      }));
    }

    if (name === 'password' || name === 'confirmpassword') {
      const password = name === 'password' ? updatedValue : formData.password;
      const confirmPassword =
        name === 'confirmpassword' ? updatedValue : formData.confirmpassword;

      setValidation((prevValidation) => ({
        ...prevValidation,
        passwordValid: passwordRegex.test(password), // Validate password with regex
        passwordMatch: password === confirmPassword, // Check if passwords match
      }));
    }

    if (name === 'dateOfBirth') {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      const isValid = selectedDate <= currentDate;
      setValidation((prevValidation) => ({
        ...prevValidation,
        dateOfBirthValid: isValid,
      }));
    }

    if (name === 'passwordExpires') {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      const isValid = selectedDate >= currentDate;
      setValidation((prevValidation) => ({
        ...prevValidation,
        passwordExpiresvalid: isValid,
      }));
    }


  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      useravatar: file,
    }));


  };


  const pageonerequiredfeilds = [
    "title",
    "firstName",
    "lastName",
    "email",

  ];
  // const pagetworequiredfeilds = [
  //   // "email",
  //   // "tel1",
  //   // "postcode",
  //   // "postalAddress",
  //   // "city",
  //   "county",
  // ];
  const pagethreerequiredfeilds = [
    "position",
    "username",
    "password",
    "confirmpassword",
    "passwordExpires",
  ];

  const areFieldsFilled = (fields) =>
    fields.every((field) => formData[field] !== "");

  const isNextDisabled1st = !areFieldsFilled(pageonerequiredfeilds);
  // const isNextDisabled2nd = !validation.emailValid || !areFieldsFilled(pagetworequiredfeilds);
  const isNextDisabled3rd = !validation.passwordMatch || !validation.dateOfBirthValid || !validation.passwordExpiresvalid || !areFieldsFilled(pagethreerequiredfeilds);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    console.log(formDataToSend);

    // Append all form fields to the FormData object
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${API_URL_USER}`, {
        method: "POST",
        body: formDataToSend,
      });

      // Handle the response as needed
      const data = await response.json();
      console.log(data)
      if (data.success) {
        toast.success(data.message);
        onClose();
        resetform();
        fetchData();
        // console.log(data);
      } else {
        toast.success(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetform = () => {
    setStep(1);
    setFormData({
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      tel1: "",
      tel2: 0,
      postcode: "",
      postalAddress: "",
      permanentAddress: "",
      city: "",
      county: "",
      // accessLevel: "",
      dateOfBirth: "",
      position: "",
      reportsTo: "",
      username: "",
      password: "",
      passwordExpires: "",
      // passwordExpiresEvery: "",
      confirmpassword: "",
      companyname: formData.companyname,
      CreatedBy: "",
      useravatar: null,
      isActive: false,
      role: "user", // Default role set to "user"
    });
  };
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Add New User
          </h2>

          <img src="/crossIcon.svg" onClick={() => {
            onClose();
            setStep(1);
          }} />

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details */}
          {step === 1 && (
            <>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="taxiFirm"
                        className="text-[10px]"
                      >
                        Title <span className="text-red-600">*</span>
                      </label>
                    </div>

                    <select
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                      required
                    >
                      <option value="">Select Title</option>
                      <option value="Mr">Mr</option>
                      <option value="Miss">Miss</option>
                      <option value="Miss">Miss</option>
                      <option value="Mrs">Mrs</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="firstName"
                        className="text-[10px]"
                      >
                        First Name <span className="text-red-600">*</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                      required
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="lastName"
                        className="text-[10px]"
                      >
                        Last Name <span className="text-red-600">*</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                      required
                      placeholder="Last name"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="email"
                        className="text-[10px]"
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
                      className={`mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] ${validation.emailValid === null
                        ? 'border-gray-300'
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

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="tel1"
                        className="text-[10px]"
                      >
                        Phone number <span className="text-red-600">*</span>
                      </label>
                    </div>

                    <input
                      type="number"
                      id="tel1"
                      name="tel1"
                      value={formData.tel1}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                      required
                    />
                  </div>
                </div>

                <h2 className="font-bold mt-4">Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/*  Building and Street (Line 1of 2) */}
                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="Building&Street"
                        className="text-[10px]"
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
                        className="text-[10px]"
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
                      resetform();
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className={`px-6 py-2 rounded-[4px] text-xs font-bold focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 ${isNextDisabled1st
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-custom-bg text-white hover:bg-gray-600"
                      }`}
                    disabled={isNextDisabled1st}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {/* {step === 2 && (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">


                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full p-2 border rounded-lg ${validation.emailValid === null
                        ? 'border-gray-300'
                        : validation.emailValid
                          ? 'border-green-500'
                          : 'border-red-500'
                        } focus:outline-none`}
                      required
                    />
                    {validation.emailValid === false && (
                      <p className="text-sm text-red-600">Invalid email format</p>
                    )}
                    {validation.emailValid === true && (
                      <p className="text-sm text-green-600">Valid email format</p>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="tel1"
                        className="text-sm font-medium text-gray-700"
                      >
                        Tel 1:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="number"
                      id="tel1"
                      name="tel1"
                      value={formData.tel1}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tel2"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tel 2:
                    </label>

                    <input
                      type="number"
                      id="tel2"
                      name="tel2"
                      value={formData.tel2}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="postcode"
                        className="text-sm font-medium text-gray-700"
                      >
                        Postcode:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="postalAddress"
                        className="text-sm font-medium text-gray-700"
                      >
                        Postal Address:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="text"
                      id="postalAddress"
                      name="postalAddress"
                      value={formData.postalAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="permanentAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Permanent Address:
                    </label>

                    <input
                      type="text"
                      id="permanentAddress"
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700"
                      >
                        City:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="county"
                        className="text-sm font-medium text-gray-700"
                      >
                        Country:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="text"
                      id="county"
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-2 justify-between">
                  <div>
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                      Back
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        resetform();
                      }}
                      className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={isNextDisabled2nd ? null : nextStep}
                      className={`px-6 py-2 rounded-lg focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 ${isNextDisabled2nd
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-custom-bg text-white hover:bg-gray-600"

                        }`}
                      disabled={isNextDisabled2nd}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )} */}
          {/* Security */}
          {step === 2 && (
            <>
              <div>
                <h3 className="font-bold mb-4">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="county"
                        className="text-[10px]"
                      >
                        Date Of Birth
                      </label>
                    </div>

                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {!validation.dateOfBirthValid && (
                      <span className="text-sm text-red-500">Date of Birth cannot be in the future.</span>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="taxiFirm"
                        className="text-[10px]"
                      >
                        Position <span className="text-red-600">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required placeholder="Building and street"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="reportsTo"
                        className="text-[10px]"
                      >
                        Reports To
                      </label>
                    </div>
                    <input
                      type="text"
                      id="reportsTo"
                      name="reportsTo"
                      value={formData.reportsTo}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Reports To"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="taxiFirm"
                        className="text-[10px]"
                      >
                        Username <span className="text-red-600">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required placeholder="Username"
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <div className="flex gap-1 items-center justify-start">
                        <label
                          htmlFor="password"
                          className="text-[10px]"
                        >
                          Password <span className="text-red-600">*</span>
                        </label>
                      </div>


                      <input
                        type={showPasswords ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                        required
                        placeholder="Password"
                      />
                      {/* <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => !prev)}
                        className="absolute right-2 top-1/2"
                      >
                        {showPasswords ? (
                          <AiOutlineEye size={20} />
                        ) : (
                          <AiOutlineEyeInvisible size={20} />
                        )}
                      </button> */}
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <div className="flex gap-1 items-center justify-start">
                        <label
                          htmlFor="confirmpassword"
                          className="text-[10px]"
                        >
                          Confirm Password <span className="text-red-600">*</span>
                        </label>
                      </div>

                      <input
                        type={showPasswords ? "text" : "password"}
                        id="confirmpassword"
                        name="confirmpassword"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        // className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        className={`mt-1 block w-full p-2 ${validation.passwordMatch === null
                          ? 'border-[#42506666]'
                          : validation.passwordMatch
                            ? 'border-green-500'
                            : 'border-red-500'
                          } focus:outline-none border border-[#42506666] rounded-[4px]`}
                        required placeholder="Confirm Password"
                      />
                      {/* <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => !prev)}
                        className="absolute right-2 top-1/2"
                      >
                        {showPasswords ? (
                          <AiOutlineEye size={20} />
                        ) : (
                          <AiOutlineEyeInvisible size={20} />
                        )}
                      </button> */}
                      <span
                        className={`text-[9px] ${validation.passwordMatch === null
                          ? "text-gray-500"
                          : validation.passwordMatch
                            ? passwordRegex.test(formData.password)
                              ? "text-green-700"
                              : "text-red-700"
                            : "text-red-700"
                          }`}
                      >
                        {validation.passwordMatch === null
                          ? "Confirm Password must be entered i.e Shah@1anything 6 characters"
                          : !validation.passwordMatch
                            ? "Confirm Password does not match i.e Shah@1anything 6 characters"
                            : !passwordRegex.test(formData.password)
                              ? "Password is not strong i.e Shah@1anything 6 characters"
                              : "Confirm Password matched Pattern Match"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-1 items-center justify-start">
                      <label
                        htmlFor="passwordExpires"
                        className="text-[10px]"
                      >
                        Password Expires <span className="text-red-600">*</span>
                      </label>
                    </div>

                    <input
                      type="date"
                      id="passwordExpires"
                      name="passwordExpires"
                      value={formData.passwordExpires}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                      required
                    />
                    {!validation.passwordExpiresvalid && (
                      <span className="text-[9px] text-red-700">Password Expires cannot be in the past.</span>
                    )}
                  </div>



                  <div>
                    <label className="text-[10px]">Status</label>
                    <div className="flex gap-4 p-2">
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
                        <span className="text-xs">Active</span>
                      </label>

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
                        <span className="text-xs">Inactive</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="useravatar"
                      className="text-[10px]"
                    >
                      Upload Image:
                    </label>
                    <input
                      type="file"
                      id="useravatar"
                      name="useravatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                    />
                  </div>

                  <div>
                    <label className="block text-[10px]">Role</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={formData.role === "admin"}
                          onChange={handleChange}
                          className="accent-blue-500"
                        />
                        <span className="text-xs">Admin</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="role"
                          value="user"
                          checked={formData.role === "user"}
                          onChange={handleChange}
                          className="accent-blue-500"
                        />
                        <span className="text-xs">User</span>
                      </label>
                    </div>
                  </div>

                </div>


                <div className="mt-6 flex gap-2 justify-between">
                  <div>
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                      Back
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        resetform();
                      }}
                      className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={nextStep}
                      className={`px-6 py-2 rounded-[4px] text-xs font-bold focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 ${isNextDisabled3rd
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-custom-bg text-white hover:bg-gray-600"
                        }`}

                      disabled={isNextDisabled3rd}
                    >
                      Next
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}
          {/* User Avatar */}
          {/* {step === 3 && (
            <>
             
              <div className="mb-4">
                <label
                  htmlFor="useravatar"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User Avatar:
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="useravatar"
                    className="flex items-center justify-center p-3  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 hover:border-gray-400 transition-all"
                  >
                    <span className="text-gray-500 text-sm font-medium bg-transparent">
                      Upload Avatar
                    </span>
                  </label>
                  <input
                    type="file"
                    id="useravatar"
                    name="useravatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                
                </div>
              </div>

              
              <div>
                <label className="block font-medium mb-2">Is Active:</label>
                <div className="flex gap-4">
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
          
              <div>
                <label className="block font-medium mb-2">Role</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span>User</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span>Admin</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-between">
                <div>
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Back
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetform();
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default AddUserModel;
