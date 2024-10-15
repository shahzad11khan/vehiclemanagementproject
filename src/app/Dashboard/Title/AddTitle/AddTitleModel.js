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
    adminCompanyName: "", // Initialize as empty
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Retrieve company name from local storage
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName"); // Replace with the actual key used in localStorage
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []); // Run only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true at the start

    try {
      // Logging formData to check if adminCompanyName is present
      console.log("Submitting Form Data: ", { ...formData });

      const response = await axios.post(`${API_URL_Title}`, formData);

      // Reset form data after successful submission
      setFormData({
        name: "",
        description: "",
        isActive: false,
        adminCreatedBy: "",
        adminCompanyName: formData.adminCompanyName, // Keep the company name for future submissions
      });
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
        onClose();
      } else {
        toast.warn(response.data.error);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to add Title");
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Button Group */}
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
