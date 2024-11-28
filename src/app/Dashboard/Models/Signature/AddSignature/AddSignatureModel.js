"use client";
import React, { useEffect, useState } from "react";
import { API_URL_Signature } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { toast } from "react-toastify";
import axios from "axios";

const AddSignatureType = ({ isOpen, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: false,
    imageName: "",
    imageFile: null,
    // imageNote: "",
    adminCreatedBy: "",
    adminCompanyName: "",
  });
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName"); // Replace with the actual key used in localStorage
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []); // Run only once when the component mounts

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

      // Append each form field to the FormData object
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Send the form data to the backend using Axios
      const response = await axios.post(
        `${API_URL_Signature}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle the response after submission
      console.log("Server response:", response.data);
      toast.success(response.data.message);
      onClose();
      fetchData();
      // Optionally, reset the form after successful submission
      setFormData({
        name: "",
        description: "",
        isActive: false,
        imageName: "",
        imageFile: null,
        // imageNote: "",
        adminCreatedBy: "",
        adminCompanyName: formData.adminCompanyName,
      });

      // Close the modal after submission
      onClose();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl max-h-screen overflow-y-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add Signature
        </h2>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="grid grid-cols-2">
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
              ></textarea>
            </div>

            {/* IsActive */}
            {/* <div className="col-span-2 flex items-center">
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
            </div> */}

            <div>
              <label className="block font-medium mb-2">Is Active:</label>
              <div className="flex gap-4">
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
              type="button"
              onClick={onClose}
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
        </form>
      </div>
    </div>
  );
};

export default AddSignatureType;
