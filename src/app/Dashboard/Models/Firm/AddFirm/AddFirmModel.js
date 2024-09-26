"use client";
import React, { useState } from "react";

const AddFirmModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    companyNo: "",
    vatNo: "",
    insurancePolicyNo: "",
    website: "",
    email: "",
    tel1: "",
    tel2: "",
    address: "",
    city: "",
    country: "",
    postcode: "",
    isActive: false,
    employmentLetter: false,
    coverLetter: false,
    signature: "",
    imageName: "",
    imageFile: null,
    imageNote: "",
  });

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
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "imageFile" && formData[key]) {
          formDataToSend.append("imageFile", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      // Submit formDataToSend to your API or server here
      console.log("Form Data:", formDataToSend);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen relative">
        <h2 className="text-3xl font-semibold text-center mb-8">Add Firm</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description:
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="companyNo"
                className="text-sm font-medium text-gray-700"
              >
                Company No:
              </label>
              <input
                type="text"
                id="companyNo"
                name="companyNo"
                value={formData.companyNo}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="vatNo"
                className="text-sm font-medium text-gray-700"
              >
                VAT No:
              </label>
              <input
                type="text"
                id="vatNo"
                name="vatNo"
                value={formData.vatNo}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="insurancePolicyNo"
                className="text-sm font-medium text-gray-700"
              >
                Insurance Policy No:
              </label>
              <input
                type="text"
                id="insurancePolicyNo"
                name="insurancePolicyNo"
                value={formData.insurancePolicyNo}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="text-sm font-medium text-gray-700"
              >
                Website:
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

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

            <div>
              <label
                htmlFor="tel1"
                className="text-sm font-medium text-gray-700"
              >
                Tel 1:
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
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

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

            <div>
              <label
                htmlFor="country"
                className="text-sm font-medium text-gray-700"
              >
                Country:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

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

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2">Is Active</span>
              </label>
            </div>
          </div>

          {/* Letter Configuration */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Letter Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="employmentLetter"
                    checked={formData.employmentLetter}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">Employment Letter</span>
                </label>
              </div>

              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="coverLetter"
                    checked={formData.coverLetter}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">Cover Letter</span>
                </label>
              </div>

              <div>
                <label
                  htmlFor="signature"
                  className="text-sm font-medium text-gray-700"
                >
                  Signature:
                </label>
                <select
                  id="signature"
                  name="signature"
                  value={formData.signature}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>
          </div>

          {/* Image Details */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Image Details</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="imageName"
                  className="text-sm font-medium text-gray-700"
                >
                  Image Name:
                </label>
                <input
                  type="text"
                  id="imageName"
                  name="imageName"
                  value={formData.imageName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="imageFile"
                  className="text-sm font-medium text-gray-700"
                >
                  Image File:
                </label>
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  accept=".jpg, .jpeg, .gif, .png"
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported file formats are jpg, jpeg, gif, png. File size
                  should be less than 2000kb. Preferred size of an image is
                  Unlimited x Unlimited (aspect ratio 1:1).
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 ml-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </form>

        {/* Close Button */}
      </div>
    </div>
  );
};

export default AddFirmModal;
