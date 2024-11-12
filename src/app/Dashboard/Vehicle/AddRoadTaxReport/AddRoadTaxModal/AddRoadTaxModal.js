"use client";
import React, { useState, useEffect } from "react";
import {
  API_URL_Vehicle_getspecificvehicleid,
  API_URL_VehicleRoadTex,
  API_URL_USER,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import { getCompanyName } from "@/utils/storageUtils";

const AddRoadTexModal = ({ isOpen, onClose, fetchData, selectedid }) => {
  const [formData, setFormData] = useState({
    VehicleName: "",
    registrationNumber: "",
    roadtexCurrentDate: "",
    roadtexDueDate: "",
    roadtexCycle: "",
    roadtexStatus: "",
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
            VehicleName: data.model, // Assuming 'model' is the key for the vehicle model
            registrationNumber: data.registrationNumber, // Assuming 'registrationNumber' is the key for registration number
            adminCompanyName: data.adminCompanyName,
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const response = await axios.post(`${API_URL_VehicleRoadTex}`, formData);
      console.log("Data sent successfully:", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
        resetform();
        onClose();
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  if (!isOpen) return null;

  const resetform = () => {
    setFormData({
      VehicleName: "",
      registrationNumber: "",
      roadtexCurrentDate: "",
      roadtexDueDate: "",
      roadtexCycle: "",
      roadtexStatus: "",
      asignto: "",
      adminCreatedBy: "",
      adminCompanyName: "",
      adminCompanyId: "",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="p-4 sm:p-6 rounded-lg shadow-lg w-full bg-white max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
          Add Road Tex
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
                Road Tax Current Date:
              </label>
              <input
                type="date"
                name="roadtexCurrentDate"
                value={formData.roadtexCurrentDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium">Road Tax Cycle:</label>
              <select
                name="roadtexCycle"
                value={formData.roadtexCycle}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Select Road Tax Cycle</option>
                <option value="3month">3 Months</option>
                <option value="6month">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-sm font-medium">Next Road Tax Date:</label>
              <input
                type="date"
                name="roadtexDueDate"
                value={formData.roadtexDueDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium">Road Tax Status:</label>
              <select
                name="roadtexStatus"
                value={formData.roadtexStatus}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="">Select Road Tax Cycle</option>
                <option value="pandding">Pandding</option>
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

export default AddRoadTexModal;
