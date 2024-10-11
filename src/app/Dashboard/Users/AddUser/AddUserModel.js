"use client";
import React, { useEffect, useState } from "react";
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
import { fetchTitle } from "../../Components/DropdownData/taxiFirm/taxiFirmService";
import { toast } from "react-toastify";

const AddUserModel = ({ isOpen, onClose, fetchData }) => {
  const [title, setTitile] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    tel1: "",
    tel2: "",
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
    const storedCompanyName = localStorage.getItem("companyName"); // Replace with the actual key used in localStorage
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        companyname: storedCompanyName,
      }));
    }
    const fetchAuthData = async () => {
      try {
        const title = await fetchTitle(); // Await the result from fetchLocalAuth
        console.log(title);
        setTitile(title.result); // Set the local state with the result
      } catch (error) {
        console.error("Error fetching local auth data:", error);
      }
    };

    fetchAuthData(); // Call the async function to fetch data
  }, []); // Run only once when the component mounts

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox for isActive
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      useravatar: e.target.files[0], // Store the selected file
    }));
  };

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
      if (data.success) {
        setFormData({
          title: "",
          firstName: "",
          lastName: "",
          email: "",
          tel1: "",
          tel2: "",
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
        toast.success(data.message);
        onClose();
        fetchData();
        // console.log(data);
      } else {
        toast.success(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">User Details</h3>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
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
                  {title.map((title) => (
                    <option key={title._id} value={title.name}>
                      {title.name}
                    </option>
                  ))}
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
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
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
                  type="tel"
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
                  type="tel"
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
          </div>

          {/* Security */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Security</h3>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
              {/* <div>
                <label
                  htmlFor="accessLevel"
                  className="text-sm font-medium text-gray-700"
                >
                  Access Level:
                </label>
                <input
                  type="text"
                  id="accessLevel"
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div> */}

              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="county"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date Of Birth:
                  </label>
                  <span className="text-red-600">*</span>
                </div>

                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
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
                  type="password"
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
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="passwordExpires"
                  className="text-sm font-medium text-gray-700"
                >
                  Password Expires:
                </label>
                <input
                  type="date"
                  id="passwordExpires"
                  name="passwordExpires"
                  value={formData.passwordExpires}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* <div>
                <label
                  htmlFor="passwordExpiresEvery"
                  className="text-sm font-medium text-gray-700"
                >
                  Password Expires Every:
                </label>
                <input
                  type="text"
                  id="passwordExpiresEvery"
                  name="passwordExpiresEvery"
                  value={formData.passwordExpiresEvery}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div> */}
            </div>
          </div>

          {/* User Avatar */}
          <div>
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
          </div>
          <div>
            <label>
              Is Active:
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Role:
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModel;
