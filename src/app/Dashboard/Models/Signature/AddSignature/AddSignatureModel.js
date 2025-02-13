"use client";
import React, { useEffect, useState } from "react";
import { API_URL_Signature } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId
} from "@/utils/storageUtils";

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
    companyId: null,

  });
   useEffect(() => {
     const storedcompanyName = getUserName() || getCompanyName(); 
     const userId = getUserId(); 
     const flag = getflag();
     const compID = getcompanyId();
     if (storedcompanyName && userId) {
     if (storedcompanyName.toLowerCase() === "superadmin" && flag === "true") {
       setFormData((prevData) => ({
           ...prevData,
           adminCompanyName: storedcompanyName,
           companyId:  compID 
         }));
       }
     } else {
       setFormData((prevData) => ({
         ...prevData,
         adminCompanyName: storedcompanyName,
         companyId: userId,
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
      <div className="bg-white px-12 py-7 rounded-xl shadow-lg w-[531px] h-[565px] overflow-y-auto">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">
          Add Signature
        </h2> */}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Add Signature
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
            // setStep(1);
          }} />
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="grid grid-cols-2">
            {/* Name */}
            <div className="col-span-2">
              <div className="flex gap-1">
                {/* <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name:
                </label>

                <span className="text-red-600">*</span> */}
                <label
                  htmlFor="name"
                  className="text-[10px]"
                >
                  Name <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                required placeholder="Name"
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
                placeholder="Image name "
              />
            </div>

            {/* Image File */}
            {/* <div className="col-span-2">
              <label
                htmlFor="imageFile"
                className="text-sm font-medium text-gray-700"
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
                Upload Image
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
              <label className="my-2 text-[10px]">Status</label>
              <div className="flex gap-4 mt-4">
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
          </div>

          {/* Button Group */}
          <div className="flex gap-[10px] justify-end mt-7">
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSignatureType;
