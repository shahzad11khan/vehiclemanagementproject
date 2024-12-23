"use client";
import React, { useEffect, useState } from "react";
import { API_URL_Firm } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchSignature } from "../../../Components/DropdownData/taxiFirm/taxiFirmService";

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
  });

  const [superadmin, setSuperadmin] = useState(null);
  const [signature, setSignatureOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // Preview for the avatar image

  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
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

        const signature = await fetchSignature();
        const filteredsignature =
          superadmin === "superadmin"
            ? signature.Result
            : signature.Result.filter(
                (signature) =>
                  signature.adminCompanyName === storedCompanyName ||
                  signature.adminCompanyName === "superadmin"
              );
        setSignatureOptions(filteredsignature);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDataForDropdowns();
  }, []);
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
    });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen relative">
        <h2 className="text-3xl font-semibold text-center mb-8">Update Firm</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
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
                  <div className="flex gap-1">
                    <label
                      htmlFor="companyNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Company No:
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
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="vatNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      VAT No:
                    </label>
                  </div>
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
                  <div className="flex gap-1">
                    <label
                      htmlFor="insurancePolicyNo"
                      className="text-sm font-medium text-gray-700"
                    >
                      Insurance Policy No:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="insurancePolicyNo"
                    name="insurancePolicyNo"
                    value={formData.insurancePolicyNo}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
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
              </div>
              <div className="mt-20 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    resetform();
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
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
                </div>

                <div>
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
                </div>

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

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country:
                    </label>
                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

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
                    type="number"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

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
                  <label className="block font-medium mb-2">Is Active:</label>
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
                    {signature.map((option) => (
                      <option key={option._id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Letter Configuration
                  </h3>
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
                  </div>
                </div>

                <div>
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
                  </div>
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
              <div className="flex gap-2 justify-between">
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 ml-2 h-10 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Back
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetform();
                    }}
                    className="px-6 py-2 ml-2 h-10 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 h-10 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
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
