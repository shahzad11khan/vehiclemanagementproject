"use client";
import React, { useEffect, useState } from "react";
import { API_URL_Signature } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { toast } from "react-toastify";
import axios from "axios";

const UpdateSignatureModel = ({
  isOpen,
  onClose,
  fetchData,
  signatureData,
}) => {
  // Added signatureData prop
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: false,
    imageName: "",
    imageFile: null,
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  useEffect(() => {
    if (signatureData) {
      const fetchEnquiry = async () => {
        try {
          const { data } = await axios.get(
            `${API_URL_Signature}/${signatureData}`
          );
          console.log("Enquiry data:", data.result);
          setFormData(data.result);
        } catch (error) {
          console.error("Error fetching enquiry data:", error);
        }
      };
      fetchEnquiry();
    }
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, [signatureData]); // Run whenever signatureData changes

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
        formDataToSend.append(key, formData[key]);
      });

      // Use PUT for updating an existing signature
      const response = await axios.put(
        `${API_URL_Signature}/${signatureData}`, // Assuming signatureData has an _id field
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);
      toast.success(response.data.message);
      onClose();
      fetchData();

      // Reset the form after successful submission
      setFormData({
        name: "",
        description: "",
        isActive: false,
        imageName: "",
        imageFile: null,
      });

      onClose();
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("An error occurred while updating the signature."); // Optional: Notify user of the error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl max-h-screen overflow-y-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
          {signatureData ? "Update Signature" : "Add Signature"}{" "}
          {/* Dynamic title */}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {/* Name */}
            <div className="col-span-2">
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
              ></textarea>
            </div>

            {/* IsActive */}
            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                IsActive
              </label>
            </div>

            {/* Image Name */}
            <div className="col-span-2">
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Image File */}
            <div className="col-span-2">
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
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                accept=".jpg, .jpeg, .gif, .png"
              />
              <p className="mt-2 text-sm text-gray-500">
                Supported file formats are jpg, jpeg, gif, png. File size should
                be less than 500kb. Preferred size of an image is Unlimited x
                Unlimited (aspect ratio 1:1).
              </p>
            </div>
          </div>

          {/* Button Group */}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {signatureData ? "Update" : "Submit"} {/* Dynamic button text */}
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

export default UpdateSignatureModel;