"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
// import { fetchTitle } from "../../Components/DropdownData/taxiFirm/taxiFirmService";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


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
    companyname: "",
    CreatedBy: "",
    useravatar: null,
    isActive: false,
    role: "user", // Default role set to "user"
  });
  const passwordRegex = /^[A-Z][a-z]+[@#$%^&*!]\d[a-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const [validation, setValidation] = useState({
    emailValid: false,
    passwordMatch: false,
    passwordValid: false,
  });

  const [imagePreview, setImagePreview] = useState(null); // Preview for the avatar image

  // Retrieve company name from local storage
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        companyname: storedCompanyName,
      }));
    }
  }, []);
  // const [title, settitle] = useState([]);

  // Fetch user data based on userId when the modal is open
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
            companyname: "", // Assuming this should be initialized empty
            username: adminData.username,
            email: adminData.email,
            password: adminData.confirmpassword, // Set password to confirmpassword
            confirmpassword: adminData.confirmpassword, // Ensure confirmpassword is set
            useravatar: adminData.useravatar,
            isActive: false, // Default value
            role: adminData.role, // Default role set to "user"
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
    // else
    //   if (name === 'confirmpassword' || name === 'password') {
    //     const password = name === 'password' ? updatedValue : formData.password;
    //     const confirmPassword =
    //       name === 'confirmpassword' ? updatedValue : formData.confirmpassword;

    //     setValidation((prevValidation) => ({
    //       ...prevValidation,
    //       passwordMatch: password === confirmPassword,
    //     }));
    //   }

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
    // setFormData({
    //   title: "",
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   tel1: "",
    //   tel2: 0,
    //   postcode: "",
    //   postalAddress: "",
    //   permanentAddress: "",
    //   city: "",
    //   county: "",
    //   // accessLevel: "",
    //   dateOfBirth: "",
    //   position: "",
    //   reportsTo: "",
    //   username: "",
    //   password: "",
    //   passwordExpires: "",
    //   // passwordExpiresEvery: "",
    //   confirmpassword: "",
    //   companyname: formData.companyname,
    //   CreatedBy: "",
    //   useravatar: null,
    //   isActive: false,
    //   role: "user", // Default role set to "user"
    // });
  };
  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-semibold text-center mb-8">Update User</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={nextStep}
                    className={`px-6 py-2 rounded-lg ${formData.firstName && formData.lastName && formData.title
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
                      required
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
                      onClick={nextStep}
                      className={`px-6 py-2 rounded-lg ${formData.email && formData.tel1 && formData.postcode && formData.postalAddress && formData.city && formData.county
                          ? "bg-custom-bg text-white hover:bg-gray-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      disabled={!formData.email || !formData.tel1 || !formData.postcode || !formData.postalAddress || !formData.city || !formData.county}
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
                                  <div className="relative">
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
                                       <button
                                                            type="button"
                                                            onClick={() => setShowPasswords((prev) => !prev)}
                                                            className="absolute right-2 top-10"
                                                          >
                                                            {showPasswords ? (
                                                              <AiOutlineEye size={20} />
                                                            ) : (
                                                              <AiOutlineEyeInvisible size={20} />
                                                            )}
                                                          </button>
                                    </div>
                
                                    <div className="relative">
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
                                        className={`mt-1 block w-full p-2 ${
                                          validation.passwordMatch === null
                                            ? 'border-gray-300'
                                            : validation.passwordMatch
                                            ? 'border-green-500'
                                            : 'border-red-500'
                                        } focus:outline-none border rounded-lg`}
                                        required
                                      />
                                       <button
                                                            type="button"
                                                            onClick={() => setShowPasswords((prev) => !prev)}
                                                            className="absolute right-2 top-10"
                                                          >
                                                            {showPasswords ? (
                                                              <AiOutlineEye size={20} />
                                                            ) : (
                                                              <AiOutlineEyeInvisible size={20} />
                                                            )}
                                                          </button>
                                                          <span
                    className={`text-sm ${
                      validation.passwordMatch === null
                        ? "text-gray-500"
                        : validation.passwordMatch
                        ? passwordRegex.test(formData.password)
                          ? "text-green-500"
                          : "text-red-500"
                        : "text-red-500"
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
                                    {/* <div className="mt-4">
                                      <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="px-4 py-2"
                                      >
                                        {showPasswords ? "Hide" : "Show"}
                                      </button>
                                    </div> */}
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
                      className={`px-6 py-2 rounded-lg ${formData.position && formData.username && formData.password && formData.confirmpassword && formData.passwordExpires && formData.password === formData.confirmpassword
                          ? "bg-custom-bg text-white hover:bg-gray-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      disabled={!formData.position || !formData.username || !formData.password || !formData.confirmpassword || !formData.passwordExpires || formData.password !== formData.confirmpassword}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 mt-2">
                  <input
                    type="file"
                    id="useravatar"
                    name="useravatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:background-gray-100 hover:file:bg-gray-200 file:text-sm"
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
              </div>

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
                    <span>Yes</span>
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
                    <span>No</span>
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

export default UpdateUserModel;