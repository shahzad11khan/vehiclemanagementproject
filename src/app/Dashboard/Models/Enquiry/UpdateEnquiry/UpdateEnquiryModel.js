"use client";
import { API_URL_Enquiry } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchBadge,
  fetchLocalAuth,
} from "../../../Components/DropdownData/taxiFirm/taxiFirmService";

const UpdateEnquiryModal = ({ isOpen, onClose, fetchData, enquiryId }) => {
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
    badgeType: "",
    localAuthority: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [superadmin, setSuperadmin] = useState(null);
  const [badgeType, setBadgeTypeOptions] = useState([]);
  const [localAuthority, setLocalAuthorityOptions] = useState([]);

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
  }, []);

  useEffect(() => {
    const fetchDataForDropdowns = async () => {
      try {
        const storedCompanyName = formData.adminCompanyName;

        const [badgesdata, authoritiesdata] = await Promise.all([
          fetchBadge(),
          fetchLocalAuth(),
        ]);

        const filteredbadges =
          superadmin === "superadmin"
            ? badgesdata.result
            : badgesdata.result.filter(
                (badge) => badge.adminCompanyName === storedCompanyName
              );

        const filteredAuthorities =
          superadmin === "superadmin"
            ? authoritiesdata.Result
            : authoritiesdata.Result.filter(
                (authority) => authority.adminCompanyName === storedCompanyName
              );

        setBadgeTypeOptions(filteredbadges);
        setLocalAuthorityOptions(filteredAuthorities);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        // toast.error("Failed to load dropdown data."); // Show toast on error
      }
    };

    fetchDataForDropdowns();
  }, [formData.adminCompanyName, superadmin]); // Add dependencies for correct useEffect behavior

  useEffect(() => {
    // Fetch existing enquiry data if enquiryId is provided (for editing)
    const fetchEnquiry = async () => {
      if (enquiryId) {
        try {
          const { data } = await axios.get(`${API_URL_Enquiry}/${enquiryId}`);
          if (data.result) {
            setFormData(data.result);
          } else {
            toast.error("No enquiry data found");
          }
        } catch (error) {
          console.error("Error fetching enquiry data:", error);
          toast.error("Error fetching enquiry data");
        }
      }
    };
    fetchEnquiry();
  }, [enquiryId]); // Run when enquiryId changes

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
      if (enquiryId) {
        // If enquiryId is present, update the record
        const response = await axios.put(
          `${API_URL_Enquiry}/${enquiryId}`,
          formData
        );
        console.log(response.data);
        toast.success("Record updated successfully");
        fetchData();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
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
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name:
                </label>
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
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name:
                </label>
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
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
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
                <label
                  htmlFor="tel1"
                  className="text-sm font-medium text-gray-700"
                >
                  Telephone 1:
                </label>
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
                <label
                  htmlFor="postcode"
                  className="text-sm font-medium text-gray-700"
                >
                  Postcode:
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Postal Address */}
              <div>
                <label
                  htmlFor="postalAddress"
                  className="text-sm font-medium text-gray-700"
                >
                  Postal Address:
                </label>
                <input
                  type="text"
                  id="postalAddress"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
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
                <label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700"
                >
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* County */}
              <div>
                <label
                  htmlFor="county"
                  className="text-sm font-medium text-gray-700"
                >
                  County:
                </label>
                <input
                  type="text"
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="text-sm font-medium text-gray-700"
                >
                  Date of Birth:
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* NI Number */}
              <div>
                <label
                  htmlFor="niNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  NI Number:
                </label>
                <input
                  type="text"
                  id="niNumber"
                  name="niNumber"
                  value={formData.niNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
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
                  {badgeType.map((option) => (
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
                  {localAuthority.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Is Active */}
              <div>
                <label htmlFor="isActive" className="text-sm font-medium">
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

              {/* Admin Created By */}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEnquiryModal;
