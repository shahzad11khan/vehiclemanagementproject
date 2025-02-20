"use client";
import React, { useState, useEffect } from "react";
import {
  API_URL_Vehicle_getspecificvehicleid,
  API_URL_VehicleRoadTex,
  API_URL_UpdateMostRecentPendingInRoadTex,
  API_URL_USER,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import { getCompanyName } from "@/utils/storageUtils";

const AddRoadTexModal = ({ isOpen, onClose, fetchData, selectedid }) => {
  const [formData, setFormData] = useState({
    VehicleName: "",
    registrationNumber: "",
    VehicleId: "",
    roadtexCurrentDate: "",
    roadtexDueDate: "",
    roadtexCycle: "",
    roadtexStatus: "",
    VehicleStatus: "",
    asignto: "",
    roadtexPending_Done: "",
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
    const filtered = users?.filter((item) => {
      console.log(item?.companyId?.CompanyName, companyNameFromStorage);
      return (
        item?.companyId?.CompanyName?.toLowerCase() === companyNameFromStorage.toLowerCase()
      );
    });
    // console.log(filtered);
    setFilteredData(filtered);
  }, [users, getCompanyName]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Determine motPending_Done based on motStatus value
    let roadtexPending_Done = formData.roadtexPending_Done;
    if (name === "roadtexStatus") {
      if (value === "done") {
        roadtexPending_Done = "0";
      } else {
        roadtexPending_Done = "1";
      }
    }
    setFormData({
      ...formData,
      [name]: value,
      roadtexPending_Done,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const response = await axios.post(`${API_URL_VehicleRoadTex}`, formData);
      console.log("Data sent successfully:", response.data);
      if (response.data.success) {
        // Check if the current record has motPending_Done set to "1"
        if (response.data.roadtexStatus === "done") {
          // Step 2: Call the PUT request to update motPending_Done from 1 to 0
          const updateResponse = await axios.put(
            `${API_URL_UpdateMostRecentPendingInRoadTex}`,
            formData
          );
          console.log("Update Response:", updateResponse.data);

          if (updateResponse.data.success) {
            console.log("RoadTex status updated successfully");
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
      roadtexCurrentDate: "",
      roadtexDueDate: "",
      roadtexCycle: "",
      roadtexStatus: "",
      asignto: "",
      adminCreatedBy: "",
      adminCompanyName: formData.adminCompanyName,
      adminCompanyId: "",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="p-12 rounded-xl shadow-lg w-full bg-white max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[80vh] overflow-y-auto">
        {/* <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
          Add Road Tex
        </h2> */}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Vehicle Road Tax
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
          }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4">
            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-[10px]">Vehicle</label>
              <input
                type="text"
                name="VehicleName"
                value={formData.VehicleName}
                onChange={handleChange}
                className="mt-1 p-2 border border-[#42506666] rounded-[4px] shadow"
                readOnly
              />
            </div>

            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-[10px]">
                Vehicle Registration No
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="mt-1 p-2 border border-[#42506666] rounded-[4px] shadow"
                readOnly
              />
            </div>

            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-[10px]">
                Road Tax Date
              </label>
              <input
                type="date"
                name="roadtexCurrentDate"
                value={formData.roadtexCurrentDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-[#42506666] rounded-[4px] shadow"
              />
            </div>

            <div className="flex flex-col flex-1 mb-4 sm:mb-0">
              <label className="text-[10px]">Next Road Tax Date</label>
              <input
                type="date"
                name="roadtexDueDate"
                value={formData.roadtexDueDate}
                onChange={handleChange}
                className="mt-1 p-2 border border-[#42506666] rounded-[4px] shadow"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-[10px]">Road Tax Cycle</label>
              <select
                name="roadtexCycle"
                value={formData.roadtexCycle}
                onChange={handleChange}
                className="mt-1 p-2 border border-[#42506666] rounded-[4px] shadow"
              >
                <option value="">Select Road Tax Cycle</option>
                <option value="3month">3 Months</option>
                <option value="6month">6 Months</option>
                <option value="1year">1 Year</option>
              </select>
            </div>



            <div className="flex flex-col flex-1">
              <label className="text-[10px]">Road Tax Status</label>
              <select
                name="roadtexStatus"
                value={formData.roadtexStatus}
                onChange={handleChange}
                className="mt-1 p-2 border border-[#42506666] rounded-[4px] shadow"
              >
                <option value="">Select Road Tax Cycle</option>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>


            <div className="flex flex-col flex-1">
              <label className="text-[10px]">Assigned To</label>
              <select
                name="asignto"
                value={formData.asignto}
                onChange={handleChange}
                className="mt-1 p-2 border border-[#42506666] rounded-[4px] shadow"
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

          <div className="mt-6 flex gap-2 justify-end">
            <button
              onClick={onClose}
              type="submit"
              className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8 $`}>
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoadTexModal;
