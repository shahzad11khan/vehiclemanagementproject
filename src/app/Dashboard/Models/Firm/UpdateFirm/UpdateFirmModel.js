"use client";
import React, { useEffect, useState } from "react";
import { API_URL_Firm } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchSignature } from "../../../Components/DropdownData/taxiFirm/taxiFirmService";
import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId
} from "@/utils/storageUtils";
const UpdateFirmModel = ({ isOpen, onClose, fetchData, firmId }) => {
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
    adminCreatedBy: "",
    adminCompanyName: "",
    companyId: null,

  });

  const [superadmin, setSuperadmin] = useState(null);
  const [signature, setSignatureOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // Preview for the avatar image

  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
 
   useEffect(() => {
      const storedcompanyName = getCompanyName() || getUserName();
      const userId = getUserId();
      const flag = getflag();
      const compID = getcompanyId();
      const storedSuperadmin = localStorage.getItem("role");
    
      // Ensure that storedSuperadmin is set correctly
      if (storedSuperadmin) {
        setSuperadmin(storedSuperadmin);
      }
    
      // Ensure that both storedcompanyName and userId are present before setting form data
      if (storedcompanyName && userId) {
        // Check if the company is "superadmin" and the flag is true
        if (storedcompanyName.toLowerCase() === "superadmin" && flag === "true" && compID) {
          setFormData((prevData) => ({
            ...prevData,
            adminCompanyName: storedcompanyName,
            companyId: compID, // Ensure compID is set
          }));
        } else {
          // Use userId if not in "superadmin" mode
          setFormData((prevData) => ({
            ...prevData,
            adminCompanyName: storedcompanyName,
            companyId: userId,
          }));
        }
      } else {
        console.error("Missing required fields:", { storedcompanyName, userId, flag, compID });
      }
    
      // Load dropdown data
      fetchDataForDropdowns();
 
    }, []);
   
    const fetchDataForDropdowns = async () => {
     try {
       const comp = getCompanyName()
 
 
       const signature = await fetchSignature();
 
       const filteredsignature =
         superadmin === "superadmin"
           ? signature.Result
           : signature.Result.filter(
             (signature) =>
               signature.adminCompanyName === comp ||
               signature.adminCompanyName === "superadmin"
           );
       setSignatureOptions(filteredsignature);
     } catch (error) {
       console.error("Error fetching dropdown data:", error);
     }
   };
  useEffect(() => {
    if (firmId) {
      console.log(firmId);
      const fetchFirmData = async () => {
        try {
          const response = await axios.get(`${API_URL_Firm}/${firmId}`);
          setFormData(response.data.result);
          setImagePreview(response.data.result.imageFile); // Show avatar preview
        } catch (error) {
          console.error("Error fetching firm data:", error);
          toast.error("Failed to load firm data.");
        }
      };

      fetchFirmData();
    }
  }, [firmId]);

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
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      const response = await axios.put(
        `${API_URL_Firm}/${firmId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      console.log("Server response:", response.data);
      onClose();
      fetchData();
      resetform();
      onClose();
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Failed to submit the form, please try again.");
    }
  };

  const resetform = () => {
    setStep(1);
    setFormData({
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
      adminCreatedBy: "",
      adminCompanyName: formData.adminCompanyName,
      companyId: formData.companyId,
    });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white px-12 py-7 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen relative">
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Update Firm
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
            setStep(1);
          }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <div>
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Name"
                  />
                </div>

                <div >
                  <label
                    htmlFor="description"
                    className="text-[10px]"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="Description"
                  />
                </div>

                {/* <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="companyNo"
                     className="text-[10px]"
                    >
                      Company No
                    </label>
                  </div>
                  <input
                    type="text"
                    id="companyNo"
                    name="companyNo"
                    value={formData.companyNo}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div> */}

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="vatNo"
                      className="text-[10px]"
                    >
                      VAT Number <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="vatNo"
                    name="vatNo"
                    value={formData.vatNo}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="VAT number"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="insurancePolicyNo"
                      className="text-[10px]"
                    >
                      Insurance Policy Number <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="insurancePolicyNo"
                    name="insurancePolicyNo"
                    value={formData.insurancePolicyNo}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow "
                    required
                    placeholder="Insurance policy number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="text-[10px]"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="Website"

                  />
                </div>

                <div>
                  <div>
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                    placeholder="Email"
                  />
                </div>

                {/* added */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="tel1"
                      className="text-[10px]"
                    >
                      Phone number <span className="text-red-600">*</span>
                    </label>

                  </div>
                  <input
                    type="tel"
                    id="tel1"
                    name="tel1"
                    value={formData.tel1}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Phone Number"
                  />
                </div>
              </div>

              <h1 className="font-bold">Address</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

                {/* added */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="city"
                      className="text-[10px]"
                    >
                      Building and Street (Line 1 of 2)
                    </label>

                  </div>
                  <input
                    // type="text"
                    // id="city"
                    // name="city"
                    // value={formData.city}
                    // onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Building and street"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="city"
                      className="text-[10px]"
                    >
                      Building and Street (Line 1 of 2)
                    </label>

                  </div>
                  <input
                    // type="text"
                    // id="city"
                    // name="city"
                    // value={formData.city}
                    // onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Building and street"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="city"
                      className="text-[10px]"
                    >
                      Town/City <span className="text-red-600">*</span>
                    </label>

                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Town/City"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="country"
                      className="text-[10px]"
                    >
                      Country <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
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
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Postcode"
                  />
                </div>

              </div>

              <div className=" flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                >
                  Cancel
                </button>
                <button
                  onClick={nextStep}
                  className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
                >
                  Next
                </button>
              </div>
            </>
          )}

{step === 2 && (
            <>
              {/* <div>
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
                </div> */}

              {/* <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address:
                  </label>
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div> */}



              {/* <div>
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
            </div> */}

              <div>
                <h3 className="font-bold mb-4">
                  Letter Configuration
                </h3>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="employmentLetter"
                        checked={formData.employmentLetter}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-xs">Employment Letter</span>
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
                      <span className="ml-2 text-xs">Cover Letter</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signature"
                  className="text-[10px]"
                >
                  Signature <span className="text-red-600">*</span>
                </label>
                <select
                  id="signature"
                  name="signature"
                  value={formData.signature}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                >
                  <option value="">Select signature</option>
                  {signature.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-bold">Image Details</h3>
                <div className="space-y-4">
                  <div>
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
                      className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                      placeholder="Image Name"
                    />
                  </div>
                </div>
              </div>

              {/* <div>
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
                  className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported file formats are jpg, jpeg, gif, png. File size
                  should be less than 2000kb. Preferred size of an image is
                  Unlimited x Unlimited (aspect ratio 1:1).
                </p>
              </div> */}

              <div className="flex items-center gap-2">
                <label
                  htmlFor="useravatar"
                  className="text-[10px]"
                >
                  Image File:
                </label>
                <input
                  type="file"
                  id="useravatar"
                  name="useravatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                />

<div>
                  {imagePreview && (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Avatar Preview"
                        className="avatar-preview w-32 h-20"
                      />
                    </div>
                  )}
                </div>
              </div>

              

              <div>
                <label className="block text-[10px] mb-3">Status</label>
                <div className="flex gap-4">
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



              {/* <h2>dd </h2> */}

              <div className="mt-36  flex justify-between gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                >
                  Back
                </button>

                <div className="flex items-center justify-center gap-[10px]">
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
              </div>
            </>
          )}
        </form>

        {/* Close Button */}
      </div>
    </div>
  );
};

export default UpdateFirmModel;
