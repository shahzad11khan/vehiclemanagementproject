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
    badgeType: "",
    localAuthority: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
  });
  const [localAuthorityOptions, setLocalAuth] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);
  const [badgeTypeOptions, setBadge] = useState([]);
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
      loadDropdownData();
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
      const response = await axios.post(`${API_URL_Enquiry}`, formData);

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
          badgeType: "",
          localAuthority: "",
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
      <div className="bg-white px-12 py-6 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">Add Enquiry</h2> */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Add Enquiry
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();

          }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex gap-1">
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
                  className="mt-1 block w-full p-2 border border-[#42506666] shadow rounded-[4px]"
                  required placeholder="First Name"
                />
              </div>

              <div>
                <div className="flex gap-1">
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
                  className="mt-1 block w-full p-2 border border-[#42506666] shadow rounded-[4px]"
                  required placeholder="Last Name"
                />
              </div>

              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="niNumber"
                    className="text-[10px]"
                  >
                    NI Number <span className="text-red-600">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  id="niNumber"
                  name="niNumber"
                  value={formData.niNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                  required placeholder="NI Number"
                />
              </div>

              <div>
                <div className="flex gap-1">
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
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                  required placeholder="Email"
                />
              </div>

              <div>
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="text-[10px]"
                  >
                    Date of Birth <span className="text-red-600">*</span>
                  </label>

                </div>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="badgeType"
                  className="text-[10px]"
                >
                  Badge Type
                </label>
                <select
                  id="badgeType"
                  name="badgeType"
                  value={formData.badgeType}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border shadow border-[#42506666] rounded-[4px]"
                >
                  <option value="">Select Badge Type</option>
                  {badgeTypeOptions.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div>
                  <label
                    htmlFor="tel1"
                    className="text-[10px]"
                  >
                    Phone Number <span className="text-red-600">*</span>
                  </label>

                </div>
                <input
                  type="tel"
                  id="tel1"
                  name="tel1"
                  value={formData.tel1}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                  required placeholder="Phone Number"
                />
              </div>

              <div>
                <label
                  htmlFor="localAuthority"
                  className="text-[10px]"
                >
                  Local Authority
                </label>
                <select
                  id="localAuthority"
                  name="localAuthority"
                  value={formData.localAuthority}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] shadow rounded-[4px]"
                >
                  <option value="">Select Local Authority</option>
                  {localAuthorityOptions.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h2 className="font-bold mt-6">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

              {/* <div>
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
              </div> */}



              <div>
                <div>
                  <label
                    htmlFor="postalAddress"
                    className="text-[10px]"
                  >
                    Building and Street (Line 1of 2)
                  </label>

                </div>
                <input
                  type="text"
                  // id="postalAddress"
                  // name="postalAddress"
                  // value={formData.postalAddress}
                  // onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                  required placeholder="Building and street"
                />
              </div>

              <div>
                <label
                  htmlFor="permanentAddress"
                  className="text-[10px]"
                >
                  Building and Street (Line 2 of 2)
                </label>
                <input
                  type="text"
                  // id="permanentAddress"
                  // name="permanentAddress"
                  // value={formData.permanentAddress}
                  // onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow" placeholder="Building and street"
                />
              </div>

              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="city"
                    className="text-[10px]"
                  >
                    Town / City <span className="text-red-600">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] shadow rounded"
                  required placeholder="Town/City"
                />
              </div>

              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="county"
                    className="text-[10px]"
                  >
                    Country <span className="text-red-600">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                  required placeholder="Country"
                />
              </div>

              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="postcode"
                    className="text-[10px]"
                  >
                    Postcode <span className="text-red-600">*</span>
                  </label>
                </div>
                <input
                  type="number"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                  required placeholder="Postcode"
                />
              </div>

              {/* <div className="col-span-1">
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
              </div> */}
              <div>
                <label className="text-[10px] mb-2">Status</label>
                <div className="flex gap-4 mt-2">
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
                      className="accent-red-700"
                    />
                    <span className="text-xs">InActive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-[10px]">
            <button
              type="button"
              onClick={onClose}
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
        </form>
      </div>
    </div>
  );
};

export default AddEnquiryModal;
