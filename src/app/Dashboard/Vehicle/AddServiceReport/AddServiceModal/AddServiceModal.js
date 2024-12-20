"use client";
import React, { useState, useEffect } from "react";
import {
  API_URL_Vehicle_getspecificvehicleid,
  API_URL_VehicleService,
  API_URL_UpdateMostRecentPendingInServeice,
  API_URL_USER,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import { getCompanyName } from "@/utils/storageUtils";

const AddServiceModal = ({ isOpen, onClose, fetchData, selectedid }) => {
  const [formData, setFormData] = useState({
    VehicleName: "",
    registrationNumber: "",
    VehicleId: "",
    serviceCurrentDate: "",
    serviceDueDate: "",
    serviceStatus: "",
    VehicleStatus: "",
    servicemailes: "",
    servicePending_Done: "",
    asignto: "",
    adminCreatedBy: "",
    adminCompanyName: "",
    adminCompanyId: "",
  });

  const [users, setUsers] = useState([]);
  const [filtered, setFilteredData] = useState([]);
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
            VehicleId: data._id, // Assuming 'model' is the key for the vehicle model
            VehicleName: data.model, // Assuming 'model' is the key for the vehicle model
            registrationNumber: data.registrationNumber, // Assuming 'registrationNumber' is the key for registration number
            adminCompanyName: data.adminCompanyName,
            VehicleStatus: data.isActive,
          }));
        } else {
          // Handle the case when there is no data
          console.warn("No data found for the selected vehicle ID.");
        }
      } catch (err) {
        console.error("Error fetching data:", err); // Log the error
      }
    } else {
      console.log("No selected ID found");
    }
  };

  const fetchCompanyuserData = async () => {
    try {
      const response = await axios.get(`${API_URL_USER}`);
      setUsers(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDat(); // Fetch data whenever the component mounts or selectedid changes
    fetchCompanyuserData();
  }, [selectedid]); // Include selectedid in the dependency array

  useEffect(() => {
    const companyNameFromStorage = getCompanyName();
    const filtered = users.filter((item) => {
      // console.log(item);
      // Ensure both strings are defined before comparing
      return (
        item.companyname &&
        companyNameFromStorage &&
        item.companyname.toLowerCase() === companyNameFromStorage.toLowerCase()
      );
    });
    // console.log(filtered);
    setFilteredData(filtered);
  }, [users, getCompanyName]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Determine motPending_Done based on motStatus value
    let servicePending_Done = formData.servicePending_Done;

    if (name === "serviceStatus") {
      if (value === "done") {
        servicePending_Done = "0";
      } else {
        servicePending_Done = "1";
      }
    }
  
    setFormData({
      ...formData,
      [name]: value,
      servicePending_Done,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const response = await axios.post(`${API_URL_VehicleService}`, formData);
      console.log("Data sent successfully:", response.data);
      if (response.data.success) {
        // Check if the current record has motPending_Done set to "1"
        if (response.data.serviceStatus === "done") {
          // Step 2: Call the PUT request to update motPending_Done from 1 to 0
          const updateResponse = await axios.put(
            `${API_URL_UpdateMostRecentPendingInServeice}`,
            formData
          );
          console.log("Update Response:", updateResponse.data);

          if (updateResponse.data.success) {
            console.log("Service status updated successfully");
          } else {
            console.log(updateResponse.data.error);
          }
        } else {
          console.log(response.data.message);
        }

        // Refresh the data and reset the form
        fetchData();
        resetform();
        onClose();
      } else {
        toast.warn(response.data.error);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  if (!isOpen) return null;

  const resetform = () => {
    setFormData({
      VehicleId: formData.VehicleId,
      VehicleName: formData.VehicleName,
      registrationNumber: formData.registrationNumber,
      VehicleStatus: formData.VehicleStatus,
      serviceCurrentDate: "",
      serviceDueDate: "",
      serviceStatus: "",
      servicemailes: "",
      asignto: "",
      adminCreatedBy: "",
      adminCompanyName: formData.adminCompanyName,
      adminCompanyId: "",
    });
  };

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
                Service Current Date:
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
                Vehicle Service Miles:
              </label>
              <input
                type="number"
                name="servicemailes"
                value={formData.servicemailes}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-sm font-medium">Next Service Date:</label>
              <input
                type="date"
                name="serviceDueDate"
                value={formData.serviceDueDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium">Sevice Status:</label>
              <select
                name="serviceStatus"
                value={formData.serviceStatus}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Select MOT Cycle</option>
                <option value="pendding">Pendding</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium">Asign To:</label>
              <select
                name="asignto"
                value={formData.asignto}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Select User</option>
                {filtered.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
            <button
              onClick={onClose}
              type="submit"
              className="w-full py-2 mt-4 bg-gray-400  text-white rounded hover:bg-black transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
