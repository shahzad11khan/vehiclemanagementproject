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
  const [perviewimage, setpreviewimage] = useState(null);
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
          setpreviewimage(data.result.imageFile);
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
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("An error occurred while updating the signature."); // Optional: Notify user of the error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white px-12 py-7 rounded-xl shadow-lg w-[531px] overflow-y-auto">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">
          {signatureData ? "Update Signature" : "Add Signature"}
        </h2> */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Update Signature
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
            // setStep(1);
          }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {/* Name */}
            <div className="col-span-2">
              {/* <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name:
              </label> */}
              <label
                htmlFor="name"
                className="text-[10px]"
              >
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="text-[10px]"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                required
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
            <h2 className="font-bold mb-0 mt-4">Image Details</h2>

            {/* Image Name */}
            <div className="col-span-2">
              <label
                htmlFor="imageName"
                className="text-[10px]"
              >
                Image Name
              </label>
              <input
                type="text"
                id="imageName"
                name="imageName"
                value={formData.imageName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Image File */}
            {/* <div className="col-span-2">
              <label
                htmlFor="imageFile"
                className="text-[10px]"
              >
                Image File
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm"
                accept=".jpg, .jpeg, .gif, .png"
              />
            </div> */}

            <div className="flex items-center gap-2 col-span-2 mt-5">
              <label
                htmlFor="imageFile"
                className="text-[10px]"
              >
                Update Image
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={handleChange}
                accept="image/*"
                className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
              />
            </div>

            <div>
              <label className="mb-2 text-[10px]">Status</label>
              <div className="flex gap-4 mt-4">
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
                    className="accent-red-500"
                  />
                  <span className="text-xs">InActive</span>
                </label>
              </div>
            </div>
            <div>
              {perviewimage && (
                <div>
                  <img
                    src={perviewimage}
                    alt="Avatar Preview"
                    className="avatar-preview w-32 h-20"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Button Group */}
          <div className="flex gap-[10px] justify-end mt-8">
            <button
              type="button"
              onClick={onClose}
              className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
            >
              {signatureData ? "Update" : "Submit"} {/* Dynamic button text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSignatureModel;
