"use client";
import { API_URL_Title } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddTitleModel = ({ isOpen, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const companyName = localStorage.getItem("companyName");
    if (companyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: companyName,
      }));
    }
  }, []);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_URL_Title, formData);
      setFormData({
        name: "",
        description: "",
        isActive: false,
        adminCreatedBy: "",
        adminCompanyName: formData.adminCompanyName,
      });
      response.data.success
        ? (toast.success(response.data.message), fetchData(), onClose())
        : toast.warn(response.data.error);
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to add Title");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">Add Title</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="flex gap-1 text-sm font-medium text-gray-700"
              >
                Name: <span className="text-red-600">*</span>
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
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
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

export default AddTitleModel;
