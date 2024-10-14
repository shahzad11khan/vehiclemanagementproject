"use client";
import { API_URL_Insurence } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UpdateInsurenceModel = ({ isOpen, onClose, fetchData, insurenceid }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Retrieve company name from local storage
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []); // Update when the manufacturer changes
  // Fetch manufacturer data when the modal opens
  useEffect(() => {
    // console.log(vehicleid);
    // alert(insurenceid);
    const fetchManufacturerData = async () => {
      setLoading(true);
      if (insurenceid) {
        try {
          const response = await axios.get(
            `${API_URL_Insurence}/${insurenceid}`
          );
          console.log(response.data.result);
          const data = response.data.result;
          if (data) {
            setFormData({
              name: data.name,
              description: data.description,
              isActive: data.isActive,
            });
          } else {
            toast.warn("Failed to fetch manufacturer data");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch manufacturer data"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchManufacturerData();
  }, [insurenceid]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use PUT for updating an existing manufacturer
      const response = await axios.put(
        `${API_URL_Insurence}/${insurenceid}`,
        formData
      );
      console.log(response);
      setFormData({
        name: "",
        description: "",
        isActive: false,
        adminCreatedBy: "",
        adminCompanyName: "",
      });

      toast.success("Data successfully updated");
      setSuccess(true);
      onClose();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update manufacturer");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Update Insurence
        </h2>

        {error && <p className="text-red-600">{error}</p>}
        {success && (
          <p className="text-green-600">Insurence updated successfully!</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>

          {/* Button Group */}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Update"}
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

export default UpdateInsurenceModel;
