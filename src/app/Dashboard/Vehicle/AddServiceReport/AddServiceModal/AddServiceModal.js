"use client";
import React, { useState, useEffect } from "react";
import { API_URL_Vehicle_getspecificvehicleid } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";

const AddServiceModal = ({
  isOpen,
  onClose,
  // fetchData,
  selectedid,
}) => {
  const [formData, setFormData] = useState({
    VehicleName: "",
    registrationNumber: "",
    serviceCurrentDate: "",
    serviceDueDate: "",
    servicemailes: "",
    serviceStatus: "",
    adminCreatedBy: "",
    adminCompanyName: "",
    adminCompanyId: "",
  });
  const fetchDat = async () => {
    if (selectedid) {
      console.log(selectedid);
      try {
        const response = await axios.get(
          `${API_URL_Vehicle_getspecificvehicleid}/${selectedid}`
        );
        console.log("get data: ", response.data);
        const data = response.data.result;

        if (data) {
          // Assuming you want to store vehicle model and registration number
          setFormData((prevData) => ({
            ...prevData,
            VehicleName: data.model, // Assuming 'model' is the key for the vehicle model
            registrationNumber: data.registrationNumber, // Assuming 'registrationNumber' is the key for registration number
            adminCompanyId: data.adminCompanyId,
          }));
        } else {
          // Handle the case when there is no data
          console.warn("No data found for the selected vehicle ID.");
        }
      } catch (err) {
        console.error("Error fetching data:", err); // Log the error
      } finally {
        // setLoading(false); // Indicate loading ended
        console.log(false);
      }
    } else {
      console.log("No selected ID found");
    }
  };

  useEffect(() => {
    const companyName = localStorage.getItem("companyName");
    if (companyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: companyName,
      }));
    }
    fetchDat(); // Fetch data whenever the component mounts or selectedid changes
  }, [selectedid]); // Include selectedid in the dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/vehicle",
    //     formData
    //   );
    //   console.log("Data sent successfully:", response.data);
    // } catch (error) {
    //   console.error("Error sending data:", error);
    // }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="p-4 sm:p-6 rounded-lg shadow-lg w-full bg-white max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
          Add Service
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-sm font-medium">Vehicle Name:</label>
              <input
                type="text"
                name="VehicleName"
                value={formData.VehicleName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
                readOnly
              />
            </div>
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-sm font-medium">
                Vehicle Registration Number:
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
                readOnly
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-sm font-medium">
                Vehicle Service Date:
              </label>
              <input
                type="date"
                name="serviceCurrentDate"
                value={formData.serviceCurrentDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-sm font-medium">
                Vehicle Next Service Date:
              </label>
              <input
                type="date"
                name="serviceDueDate"
                value={formData.serviceDueDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium">
                Vehicle Service Status:
              </label>
              <select
                name="serviceStatus"
                value={formData.serviceStatus}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Select MOT Cycle</option>
                <option value="pandding">Pandding</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-sm font-medium">
                Vehicle Service Miles:
              </label>
              <input
                type="text"
                name="servicemailes"
                value={formData.servicemailes}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              type="submit"
              className="w-full py-2 mt-4 bg-gray-400  text-white rounded hover:bg-black transition"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
