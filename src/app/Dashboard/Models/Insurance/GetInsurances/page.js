"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddInsuranceModel from "../AddInsurance/AddInsuranceModel";
import UpdateInsuranceModel from "../UpdateInsurence/UpdateInsurenceModel";
import axios from "axios";
import { API_URL_Insurence } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetInsurence } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenInsurance, setIsOpenInsurance] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const { result } = await GetInsurence();
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
    try {
      const response = await axios.delete(`${API_URL_Insurence}/${id}`);
      const { data } = response;

      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Supplier deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the Supplier.");
      }
    } catch (error) {
      console.error("Error deleting Supplier:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Supplier. Please try again."
      );
    }
  };

  // Filter data based on search term and selected company
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

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenInsuranceModel = () => {
    setIsOpenInsurance(!isOpenInsurance);
  };

  const handleEdit = (id) => {
    // alert(id);
    setSelectedUserId(id);
    setIsOpenVehcleUpdate(true);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
  };
  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between mb-4">
              {/* Search Input */}
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              {/* Add User Button */}
              <div className="justify-end">
                <button
                  onClick={OpenInsuranceModel}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Insurance
                </button>
              </div>
            </div>

            {/* Tailwind CSS Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Insurance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Insurance Description
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Insurance Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.description}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {item.adminCompanyName}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
      <AddInsuranceModel
        isOpen={isOpenInsurance}
        onClose={OpenInsuranceModel}
        fetchData={fetchData}
      />
      <UpdateInsuranceModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        insurenceid={selectedUserId}
      />
    </>
  );
};

export default Page;
