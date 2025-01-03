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

const AddUserModel = ({ isOpen, onClose, fetchData }) => {
  // const [title, setTitile] = useState([]);
  // const [role, setrole] = useState(null);
  // const [previewAvatar, setPreviewAvatar] = useState(null);
  const [showPasswords, setShowPasswords] = useState(false);
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const [validation, setValidation] = useState({
    emailValid: null,
    passwordMatch: null,
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    if (name === 'email') {
      setValidation((prevValidation) => ({
        ...prevValidation,
        emailValid: emailRegex.test(updatedValue),
      }));
    } else if (name === 'confirmpassword' || name === 'password') {
      const password = name === 'password' ? updatedValue : formData.password;
      const confirmPassword =
        name === 'confirmpassword' ? updatedValue : formData.confirmpassword;

      setValidation((prevValidation) => ({
        ...prevValidation,
        passwordMatch: password === confirmPassword,
      }));
    }
  };

  const handleFileChange = (e) => {
     const file = e.target.files[0];
    // Update the formData and preview avatar
    setFormData((prevData) => ({
      ...prevData,
      useravatar: file, // Store the selected file
    }));

    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = () => setPreviewAvatar(reader.result); // Set preview image
    //   reader.readAsDataURL(file);
    // }
  };


  const pageonerequiredfeilds = [
    "title",
    "firstName",
    "lastName",
    
  ];
  const pagetworequiredfeilds = [
    "email",
    "tel1",
    "postcode",
    "postalAddress",
    "city",
    "county",
     ];
  const pagethreerequiredfeilds = [
    "position",
    "username",
    "password",
    "confirmpassword",
    "passwordExpires",
     ];
 
     const areFieldsFilled = (fields) =>
      fields.every((field) => formData[field] !== "");
    
  const isNextDisabled1st =  !areFieldsFilled(pageonerequiredfeilds);
  const isNextDisabled2nd = !validation.emailValid || !areFieldsFilled(pagetworequiredfeilds);
  const isNextDisabled3rd = !validation.passwordMatch || !areFieldsFilled(pagethreerequiredfeilds);

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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details */}
          {step === 1 && (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-2">User Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="taxiFirm"
                        className="text-sm font-medium text-gray-700"
                      >
                        Title:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>

                    <select
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
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
                    <div className="flex gap-1">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>

                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>

                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2 justify-end">
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
                    onClick={nextStep}
                    className={`px-6 py-2 rounded-lg focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 ${
                      isNextDisabled1st
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
          {/* Contact Information */}
          {step === 2 && (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {/* <div>
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
                      // className=" border-gray-300 rounded-lg"
                      className={`mt-1 block w-full p-2 border rounded-lg${
                        validation.emailValid === null
                          ? 'border-gray-300'
                          : validation.emailValid
                          ? 'border-green-500'
                          : 'border-red-500'
                      } focus:outline-none`}
                      required
                    />
                  </div> */}

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
        className={`mt-1 block w-full p-2 border rounded-lg ${
          validation.emailValid === null
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
                      onClick={isNextDisabled2nd ? null : nextStep }
                      className={`px-6 py-2 rounded-lg focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 ${
                        isNextDisabled2nd
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
          )}
          {/* Security */}
          {step === 3 && (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-4">Security</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
             

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="county"
                        className="text-sm font-medium text-gray-700"
                      >
                        Date Of Birth:
                      </label>
                    </div>

                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="position"
                        className="text-sm font-medium text-gray-700"
                      >
                        Position:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reportsTo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Reports To:
                    </label>
                    <input
                      type="text"
                      id="reportsTo"
                      name="reportsTo"
                      value={formData.reportsTo}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="username"
                        className="text-sm font-medium text-gray-700"
                      >
                        Username:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div>
                      <div className="flex gap-1">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Password:
                        </label>
                        <span className="text-red-600">*</span>
                      </div>
                      <input
                        type={showPasswords ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex gap-1">
                        <label
                          htmlFor="confirmpassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          Confirm Password:
                        </label>
                        <span className="text-red-600">*</span>
                      </div>
                      <input
                        type={showPasswords ? "text" : "password"}
                        id="confirmpassword"
                        name="confirmpassword"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        // className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        className={`mt-1 block w-full p-2 border rounded-lg${
                          validation.passwordMatch === null
                            ? 'border-gray-300'
                            : validation.passwordMatch
                            ? 'border-green-500'
                            : 'border-red-500'
                        } focus:outline-none`}
                        required
                      />
                      <span
    className={`text-sm ${
      validation.passwordMatch === null
        ? 'text-gray-500'
        : validation.passwordMatch
        ? 'text-green-500'
        : 'text-red-500'
    }`}
  >
    {validation.passwordMatch === null
      ? 'ConfirmPassword must match'
      : validation.passwordMatch
      ? 'ConfirmPassword matched'
      : 'ConfirmPassword not matched'}
  </span>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="px-4 py-2"
                      >
                        {showPasswords ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="passwordExpires"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password Expires:
                      </label>
                      <span className="text-red-600">*</span>
                    </div>

                    <input
                      type="date"
                      id="passwordExpires"
                      name="passwordExpires"
                      value={formData.passwordExpires}
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
                      onClick={nextStep}
                      className={`px-6 py-2 rounded-lg focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 ${
                        isNextDisabled3rd
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
          {step === 4 && (
            <>
              {/* <div>
                <label
                  htmlFor="useravatar"
                  className="text-sm font-medium text-gray-700"
                >
                  User Avatar:
                </label>
                <input
                  type="file"
                  id="useravatar"
                  name="useravatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div> */}
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
                  {/* <img
                    src={previewAvatar || "/default-avatar.png"} // Use preview logic or a default image
                    alt="Avatar Preview"
                    className="w-32 h-32 rounded-lg border border-gray-300 object-cover"
                  /> */}
                </div>
              </div>

              {/* <div>
                <label>
                  Is Active:
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
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

              {/* <div>
                <label>
                  Role:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              </div> */}
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

                  {/* Admin Role */}
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
          )}
        </form>
      </div>
    </div>
  );
};

export default AddUserModel;
