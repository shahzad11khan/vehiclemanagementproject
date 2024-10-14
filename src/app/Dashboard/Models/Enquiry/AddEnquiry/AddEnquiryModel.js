"use client";
import { API_URL_Enquiry } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchBadge,
  fetchLocalAuth,
} from "../../../Components/DropdownData/taxiFirm/taxiFirmService";

const AddEnquiryModal = ({ isOpen, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
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
    dateOfBirth: "",
    niNumber: "",
    badgeType: "", // Updated
    localAuthority: "", // New Field
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
  });
  const [localAuthorityOptions, setLocalAuth] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);
  const [badgeTypeOptions, setBadge] = useState([]);
  // Load company name and role from localStorage
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    const storedSuperadmin = localStorage.getItem("role");

    if (storedSuperadmin) {
      setSuperadmin(storedSuperadmin);
    }

    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []); // Run only once on mount
  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [badgeData, localAuthData] = await Promise.all([
          fetchBadge(),
          fetchLocalAuth(),
        ]);

        const storedCompanyName = formData.adminCompanyName;

        const filteredBadges =
          superadmin === "superadmin"
            ? badgeData.result
            : badgeData.result.filter(
                (badge) =>
                  badge.adminCompanyName === storedCompanyName ||
                  badge.adminCompanyName === "superadmin"
              );

        const filteredLocalAuth =
          superadmin === "superadmin"
            ? localAuthData.Result
            : localAuthData.Result.filter(
                (localAuth) =>
                  localAuth.adminCompanyName === storedCompanyName ||
                  localAuth.adminCompanyName === "superadmin"
              );

        setBadge(filteredBadges);
        setLocalAuth(filteredLocalAuth);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    if (superadmin !== null && formData.adminCompanyName) {
      loadDropdownData(); // Ensure dropdown data is only loaded when role and companyName are available
    }
  }, [superadmin, formData.adminCompanyName]); // Re-run when superadmin or companyName changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the backend using Axios
      const response = await axios.post(`${API_URL_Enquiry}`, formData); // Replace with your API endpoint

      if (response.data.success) {
        console.log("Form submitted successfully:", response.data);
        setFormData({
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
          dateOfBirth: "",
          niNumber: "",
          badgeType: "", // Updated
          localAuthority: "", // New Field
          isActive: false,
          adminCreatedBy: "",
          adminCompanyName: formData.adminCompanyName,
        });
        toast.success(response.data.message);
        onClose();
        fetchData();
      } else {
        toast.warn(response.data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-semibold text-center mb-8">Add Enquiry</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Driver Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Enquiry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* First Name */}
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

              {/* Last Name */}
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

              {/* Email */}
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

              {/* Telephone 1 */}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="tel1"
                    className="text-sm font-medium text-gray-700"
                  >
                    Telephone 1:
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

              {/* Telephone 2 */}
              <div>
                <label
                  htmlFor="tel2"
                  className="text-sm font-medium text-gray-700"
                >
                  Telephone 2:
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

              {/* Postcode */}
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

              {/* Postal Address */}
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

              {/* Permanent Address */}
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

              {/* City */}
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

              {/* County */}
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

              {/* Date of Birth */}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date of Birth:
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

              {/* National Insurance Number */}
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="niNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    NI Number:
                  </label>

                  <span className="text-red-600">*</span>
                </div>
                <input
                  type="text"
                  id="niNumber"
                  name="niNumber"
                  value={formData.niNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Badge Type Dropdown */}
              <div>
                <label
                  htmlFor="badgeType"
                  className="text-sm font-medium text-gray-700"
                >
                  Badge Type:
                </label>
                <select
                  id="badgeType"
                  name="badgeType"
                  value={formData.badgeType}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Badge Type</option>
                  {badgeTypeOptions.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Local Authority Dropdown */}
              <div>
                <label
                  htmlFor="localAuthority"
                  className="text-sm font-medium text-gray-700"
                >
                  Local Authority:
                </label>
                <select
                  id="localAuthority"
                  name="localAuthority"
                  value={formData.localAuthority}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Local Authority</option>
                  {localAuthorityOptions.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* IsActive Checkbox */}
              <div className="col-span-1">
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Is Active:
                </label>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mt-1 block"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 m-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEnquiryModal;
