"use client";
import React, { useState, useEffect } from "react";
import { API_URL_Company } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";

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
    image: null,
  });

  // Fetch company details when the modal opens
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
            image: null, // Image should be handled separately if required
          });
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
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
      console.log(response);
      toast.success("Company updated successfully");
      fetchData();
      onClose();
    } catch (error) {
      console.error("Error updating company details:", error);
      toast.error("Error updating company details");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Update Company
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="CompanyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                type="text"
                id="CompanyName"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* CompanyRegistrationNumber*/}
            <div>
              <label
                htmlFor="CompanyRegistrationNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Company Registration Number
              </label>
              <input
                type="text"
                id="CompanyRegistrationNumber"
                name="CompanyRegistrationNumber"
                value={formData.CompanyRegistrationNumber}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {/* vatnumber*/}
            <div>
              <label
                htmlFor="vatnumber"
                className="block text-sm font-medium text-gray-700"
              >
                Vat Number
              </label>
              <input
                type="text"
                id="vatnumber"
                name="vatnumber"
                value={formData.vatnumber}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* IsActive Checkbox */}
            <div className="flex items-center">
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
            </div>

            {/* Upload Image */}
            <div>
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
            </div>
          </div>

          {/* Button Group */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCompanyModel;
