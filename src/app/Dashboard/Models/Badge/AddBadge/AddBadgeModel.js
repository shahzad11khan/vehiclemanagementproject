"use client";
import { API_URL_Badge } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const AddBadgeModel = ({ isOpen, onClose, fetchData }) => {
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
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []);
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
      const response = await axios.post(`${API_URL_Badge}`, formData);

      console.log(response);

      if (response.data.success) {
        setFormData({
          name: "",
          description: "",
          isActive: false,
          adminCreatedBy: "",
          adminCompanyName: formData.adminCompanyName,
        });
        toast.success("data successfully saved");
        setSuccess(true);
        fetchData();
        onClose();
      } else {
        toast.warn(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add badge");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">Add Badge</h2>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Badge added successfully!</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-2">
              <div className="flex gap-1">
                <label
                  htmlFor="firstName"
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
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                // resetform();
              }}
              className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBadgeModel;
