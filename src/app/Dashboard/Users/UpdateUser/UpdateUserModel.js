"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
// import { fetchTitle } from "../../Components/DropdownData/taxiFirm/taxiFirmService";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId
} from "@/utils/storageUtils";

const UpdateUserModel = ({ isOpen, onClose, fetchData, userId }) => {
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const [showPasswords, setShowPasswords] = useState(false);
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
    accessLevel: "",
    dateOfBirth: "",
    position: "",
    reportsTo: "",
    username: "",
    password: "",
    passwordExpires: "",
    passwordExpiresEvery: "",
    confirmpassword: "",
    companyName: "",
    CreatedBy: "",
    useravatar: null,
    isActive: false,
    role: "user", // Default role set to "user"
    userId:"",
    companyId:"",
    Postcode:"",
    BuildingAndStreetOne:"",
    BuildingAndStreetTwo:"",
    Town_City:"",
    Country:"",
  });
  const passwordRegex = /^[A-Z][a-z]+[@#$%^&*!]\d[a-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const [validation, setValidation] = useState({
    emailValid: false,
    passwordMatch: false,
    passwordValid: false,
    dateOfBirthValid: true,
    passwordExpiresvalid: false


  });

  const [imagePreview, setImagePreview] = useState(null); // Preview for the avatar image

  // Retrieve company name from local storage
  const randomObjectId = () => {
    return (
      Math.floor(Date.now() / 1000).toString(16) + // Timestamp
      'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () =>
        ((Math.random() * 16) | 0).toString(16)
      )
    );
  };
 useEffect(() => {
   const storedcompanyName = getUserName() || getCompanyName(); 
   const userId = getUserId(); 
   const flag = getflag();
   const compID = getcompanyId();
   const randomId = randomObjectId();
 
   // console.log(userId, storedcompanyName, flag, compID);
 
   if (storedcompanyName && userId) {
     if (flag === "false") {
       setFormData((prevData) => ({
         ...prevData,
         companyName: storedcompanyName,
         userId: storedcompanyName.toLowerCase() === "superadmin" ? userId : randomId,
         companyId: randomId,
       }));
     } else if (flag === "true") {
       setFormData((prevData) => ({
         ...prevData,
         companyName: storedcompanyName,
         userId: randomId,
         companyId: storedcompanyName.toLowerCase() === "superadmin" ? compID : randomId,
       }));
     }
   } else {
     setFormData((prevData) => ({
       ...prevData,
       companyName: storedcompanyName,
       userId: randomId,
       companyId: userId,
     }));
   }
 }, []);
 

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${API_URL_USER}/${userId}`);
          const adminData = res.data.result;
          console.log("profile", adminData);

          setFormData({
            title: adminData.title, // Assuming this should be initialized empty
            firstName: adminData.firstName, // Assuming this should be initialized empty
            lastName: adminData.lastName, // Assuming this should be initialized empty
            tel1: adminData.tel1, // Assuming this should be initialized empty
            tel2: adminData.tel2, // Assuming this should be initialized empty
            postcode: adminData.postcode, // Assuming this should be initialized empty
            postalAddress: adminData.postalAddress, // Assuming this should be initialized empty
            permanentAddress: adminData.permanentAddress, // Assuming this should be initialized empty
            city: adminData.city, // Assuming this should be initialized empty
            county: adminData.county, // Assuming this should be initialized empty
            accessLevel: adminData.accessLevel, // Assuming this should be initialized empty
            dateOfBirth: adminData.dateOfBirth, // Assuming this should be initialized empty
            position: adminData.position, // Assuming this should be initialized empty
            reportsTo: adminData.reportsTo, // Assuming this should be initialized empty
            passwordExpires: adminData.passwordExpires, // Assuming this should be initialized empty
            passwordExpiresEvery: adminData.repopasswordExpiresEveryrtsTo, // Assuming this should be initialized empty
            companyName: "", // Assuming this should be initialized empty
            username: adminData.username,
            email: adminData.email,
            password: adminData.confirmpassword, // Set password to confirmpassword
            confirmpassword: adminData.confirmpassword, // Ensure confirmpassword is set
            useravatar: adminData.useravatar,
            isActive: false, // Default value
            role: adminData.role, // Default role set to "user"
            Postcode:adminData.Postcode,
            BuildingAndStreetOne:adminData.BuildingAndStreetOne,
            BuildingAndStreetTwo:adminData.BuildingAndStreetTwo,
            Town_City:adminData.Town_City,
            Country:adminData.Country,
            // ...adminData, // Ensure the rest of the data is updated
          });

          setImagePreview(adminData.useravatar); // Show avatar preview
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      // Call fetchData to populate the form
      fetchData();
      // loadTaxiFirms();
    }
  }, [userId]);


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

  // const isNextDisabled = !validation.emailValid;
  // const ispasswordmatch = !validation.passwordMatch;
  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      useravatar: file, // Store the selected file
    }));
    setImagePreview(URL.createObjectURL(file)); // Preview the selected image
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append all form fields to the FormData object
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Add the user avatar file to FormData
    if (formData.useravatar) {
      formDataToSend.append("useravatar", formData.useravatar);
    }

    try {
      const response = await fetch(`${API_URL_USER}/${userId}`, {
        method: "PUT", // Use PUT or PATCH for updates
        body: formDataToSend,
      });

      // Handle the response as needed
      const data = await response.json();
      toast.success(data.message);
      // console.log("Update successful:", data);

      // Optionally close the modal on successful update
      resetform();
      onClose();
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const resetform = () => {
    setStep(1);
   
  };
  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white px-12 py-7 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-screen">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">Update User</h2> */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Update User
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();

          }} />

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                {/* <h3 className="text-xl font-semibold mb-2">User Details</h3> */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
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
                      className={`mt-1 block w-full p-2 border border-[#42506666] rounded shadow ${validation.emailValid === null
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded"
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
                      name="BuildingAndStreetOne"
                      value={formData.BuildingAndStreetOne}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
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
                      name="BuildingAndStreetTwo"
                      value={formData.BuildingAndStreetTwo}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                      required placeholder="Building and street"
                    />
                  </div>

                  {/*  Town/City */}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="companyName"
                        className="text-[10px] "
                      >
                        Town/City
                      </label>
                    </div>

                    <input
                      type="text"
                      id="Building&Street"
                      name="Town_City"
                      value={formData.Town_City}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                      required placeholder="Town/City"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="companyName"
                        className="text-[10px] "
                      >
                        Country
                      </label>
                    </div>

                    <input
                      type="text"
                      id="Building&Street"
                      name="Country"
                      value={formData.Country}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                      required placeholder="Country"
                    />
                  </div>

                  {/* Postcode */}
                  <div>
                    <div className="flex gap-1">
                      <label
                        htmlFor="companyName"
                        className="text-[10px]"
                      >
                        Postcode
                      </label>
                    </div>

                    <input
                      type="text"
                      id="Building&Street"
                      name="Postcode"
                      value={formData.Postcode}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                      required placeholder="Postcode"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className={`bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8 ${formData.firstName && formData.lastName && formData.title
                      ? "bg-custom-bg text-white hover:bg-gray-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    disabled={!formData.firstName || !formData.lastName || !formData.title}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                        className="mt-1 block w-full p-2 border border-[#42506666] rounded"
                        required
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((prev) => !prev)}
                        className="absolute right-2 top-1/2"
                      >
                        {showPasswords ? (
                          <AiOutlineEye size={20} />
                        ) : (
                          <AiOutlineEyeInvisible size={20} />
                        )}
                      </button> 
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
                          } focus:outline-none border border-[#42506666] rounded`}
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded"
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
                    {imagePreview && (
                      <div>
                        <img
                          src={imagePreview}
                          alt="Avatar Preview"
                          className="avatar-preview w-32 h-20"
                        />
                      </div>
                    )}
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
                      className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
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
                      className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}





        </form>
      </div>
    </div>
  );
};

export default UpdateUserModel;