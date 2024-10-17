"use client";
import {
  API_URL_DriverMoreInfo,
  API_URL_Driver,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { API_URL_Drivercalculation } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddDriverMoreInfoModal = ({
  isOpen,
  onClose,
  fetchData,
  selectedUserId,
}) => {
  const [formData, setFormData] = useState({
    driverId: "",
    vehicle: "",
    startDate: "",
    calculation: "",
    endDate: "",
    subtractcalculation: "",
    remaining: "",
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

  useEffect(() => {
    const fetchManufacturerData = async () => {
      setLoading(true);
      if (selectedUserId) {
        try {
          const response = await axios.get(
            `${API_URL_Driver}/${selectedUserId}`
          );
          console.log(response.data.result);
          const data = response.data.result;
          if (data) {
            setFormData({
              driverId: data._id,
              vehicle: data.vehicle,
              startDate: data.startDate,
              calculation: data.calculation,
              subtractcalculation: "", // Reset this to ensure fresh data
              remaining: "", // Reset remaining too
              adminCreatedBy: "",
              adminCompanyName: formData.adminCompanyName,
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
  }, [selectedUserId]);

  // Calculate remaining when calculation or subtractcalculation changes
  useEffect(() => {
    const calculationValue = parseFloat(formData.calculation) || 0;
    const subtractCalculationValue =
      parseFloat(formData.subtractcalculation) || 0;
    const newRemaining = calculationValue - subtractCalculationValue;
    setFormData((prevData) => ({
      ...prevData,
      remaining: newRemaining,
    }));
  }, [formData.calculation, formData.subtractcalculation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // console.log(formData);
    try {
      const response = await axios.post(`${API_URL_DriverMoreInfo}`, formData);
      console.log(response);

      // Reset form fields
      setFormData({
        driverId: "",
        vehicle: "",
        startDate: "",
        calculation: "",
        endDate: "",
        subtractcalculation: "",
        remaining: "",
        adminCreatedBy: "",
        adminCompanyName: formData.adminCompanyName,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setSuccess(true);
        fetchData();
        onClose();
        // update once again
        const formDataToSend = new FormData();
        const specificFieldKeycalculation = "calculation";
        const specificFieldKeystartDate = "startDate";
        formDataToSend.set(specificFieldKeycalculation, formData.remaining);
        formDataToSend.set(specificFieldKeystartDate, formData.endDate);
        if (formData) {
          Object.keys(formData).forEach((key) => {
            if (
              key !== specificFieldKeycalculation &&
              key !== specificFieldKeystartDate
            ) {
              formDataToSend.append(key, formData[key]);
            }
          });
        }
        const res = await axios.put(
          `${API_URL_Drivercalculation}/${selectedUserId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Update specific field successful:", res.data);
        // End update
      } else {
        console.log(res.data.error);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add driver info");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add Driver Info
        </h2>

        {error && <p className="text-red-600">{error}</p>}
        {success && (
          <p className="text-green-600">Driver info added successfully!</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="driverId"
                className="text-sm font-medium text-gray-700"
              >
                Driver ID:
              </label>
              <input
                type="text"
                id="driverId"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="vehicle"
                className="text-sm font-medium text-gray-700"
              >
                Vehicle:
              </label>
              <input
                type="text"
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700"
              >
                Start Date:
              </label>
              <input
                type="text"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="calculation"
                className="text-sm font-medium text-gray-700"
              >
                Calculation:
              </label>
              <input
                type="number"
                id="calculation"
                name="calculation"
                value={formData.calculation}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700"
              >
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="subtractcalculation"
                className="text-sm font-medium text-gray-700"
              >
                Subtract Calculation:
              </label>
              <input
                type="number"
                id="subtractcalculation"
                name="subtractcalculation"
                value={formData.subtractcalculation}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="remaining"
                className="text-sm font-medium text-gray-700"
              >
                Remaining:
              </label>
              <input
                type="number"
                id="remaining"
                name="remaining"
                value={formData.remaining}
                readOnly
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Loading...." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverMoreInfoModal;
