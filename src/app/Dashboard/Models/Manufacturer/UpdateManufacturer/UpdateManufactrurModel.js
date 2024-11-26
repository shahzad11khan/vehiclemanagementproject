"use client";
import { API_URL_Manufacturer } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCompanyName,
  getsuperadmincompanyname,
  getUserRole,
} from "@/utils/storageUtils";
import { fetchCarModel } from "../../../Components/DropdownData/taxiFirm/taxiFirmService";

const UpdateManufacturerModel = ({
  isOpen,
  onClose,
  fetchData,
  manufacturerid,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    carmodel: "",
    isActive: false,
    adminCompanyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedCompanyName = getCompanyName() || getsuperadmincompanyname();

    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []);

  const fetchManufacturerData = async () => {
    if (!manufacturerid) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL_Manufacturer}/${manufacturerid}`
      );
      const data = response.data.result;
      if (data) {
        setFormData({
          name: data.name,
          carmodel: data.carmodel,
          description: data.description,
          isActive: data.isActive,
        });
      } else {
        toast.warn("Failed to fetch manufacturer data");
      }

      const title = await fetchCarModel();
      const role = getUserRole();
      console.log(title);
      const filteredTaxiFirms =
        role === "superadmin"
          ? title.result
          : title.result.filter((firm) => firm.adminCompanyName === stored);

      setData(filteredTaxiFirms);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchManufacturerData();
  }, [manufacturerid]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL_Manufacturer}/${manufacturerid}`,
        formData
      );
      // console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          name: "",
          description: "",
          isActive: false,
          adminCompanyName: "",
        });
        onClose();
        fetchData();
      } else {
        toast.success(response.data.error);
      }
    } catch (err) {
      console.log(
        err.response?.data?.message || "Failed to update manufacturer"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add Manufacturer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="col-span-2">
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
            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="carmodel"
                  className="text-sm font-medium text-gray-700"
                >
                  Model:
                </label>
              </div>
              <select
                id="carmodel"
                name="carmodel"
                value={formData.carmodel}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Model</option>
                {data.map((title) => (
                  <option key={title._id} value={title.name}>
                    {title.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full">
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

export default UpdateManufacturerModel;
