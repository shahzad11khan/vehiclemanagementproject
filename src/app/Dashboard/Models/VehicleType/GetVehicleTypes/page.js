"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddVehicleType from "../AddVehicleType/AddVehicleType";
import UpdateVehicleType from "../UpdateVehicleType/UpdateVehicleModel";
import axios from "axios";
import { API_URL_VehicleType } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetVehicleType } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenVehicleType, setIsOpenVehicleType] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const { result } = await GetVehicleType();
      console.log(result);
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting ID:", id);
    try {
      const response = await axios.delete(`${API_URL_VehicleType}/${id}`);
      const { data } = response;

      console.log("Response Data:", data);

      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Manufacturer deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the Manufacturer.");
      }
    } catch (error) {
      console.error("Error deleting Manufacturer:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Manufacturer. Please try again."
      );
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        selectedCompanyName &&
        item.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const usernameMatch =
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);
  }, [searchTerm, data, selectedCompanyName]);

  const OpenVehicleTypeModle = () => {
    setIsOpenVehicleType(!isOpenVehicleType);
  };

  const handleEdit = (id) => {
    // alert(id);
    setSelectedUserId(id);
    setIsOpenVehcleUpdate(true);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64" // Tailwind CSS classes for input
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenVehicleTypeModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Vehicle Type
                </button>
              </div>
            </div>

            {/* Tailwind CSS Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">
                      Vehicle Type
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Description
                    </th>
                    {/* <th className="border border-gray-300 p-2 text-left">
                      Company
                    </th> */}
                    <th className="border border-gray-300 p-2 text-left">
                      Status
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.description}
                      </td>
                      {/* <td className="border border-gray-300 p-2">
                        {item.adminCompanyName}
                      </td> */}
                      <td className="border border-gray-300 p-2">
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddVehicleType
        isOpen={isOpenVehicleType}
        onClose={OpenVehicleTypeModle}
        fetchData={fetchData}
      />

      <UpdateVehicleType
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        vehicleid={selectedUserId}
      />
    </>
  );
};

export default Page;
