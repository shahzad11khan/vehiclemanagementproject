"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCarModel from "../AddCarModel/AddCarmodel";
import UpdateCarModel from "../UpdateCarModel/UpdateCarModel";
import axios from "axios";
import { API_URL_CarModel } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetCarModel } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName, getsuperadmincompanyname, getUserRole } from "@/utils/storageUtils";

const Page = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenBadge, setIsOpenBadge] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehicleUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage =
      getCompanyName() || getsuperadmincompanyname();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const companyName = getCompanyName(); // Get the user's company name
      const isSuperAdmin = getUserRole(); // Function to check if the user is superadmin
      const { result } = await GetCarModel(); // Fetch car models

      // Filter the data based on user role
      const filtered = isSuperAdmin === "superadmin"
        ? result // Superadmin sees all data
        : result.filter((item) =>
          item.adminCompanyName.toLowerCase() === companyName.toLowerCase()
        ); // Regular user sees only their company's data

      // Update state with the filtered data
      setData(filtered);
      setFilteredData(filtered);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error by setting empty data
      setData([]);
      setFilteredData([]);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_CarModel}/${id}`);
      const { data } = response;
      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        toast.success(data.message || "CarModel deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the Badge.");
      }
    } catch (error) {
      console.error("Error deleting Badge:", error);
      toast.error(
        error.response?.data?.message ||
        "An error occurred while deleting the Badge. Please try again."
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

  const OpenBadgeModle = () => {
    setIsOpenBadge(!isOpenBadge);
  };

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenVehicleUpdate(true);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehicleUpdate(!isOpenVehicleUpdate);
  };

  const totalPages = Math.ceil(filteredData.length / itemperpage);
  const startIndex = (currentPage - 1) * itemperpage;
  const currentRecords = filteredData.slice(
    startIndex,
    startIndex + itemperpage
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 h-screen">
          <div className="justify-between mx-auto items-center  mt-3 w-full">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="text-custom-bg mt-2">Show</div>
                <div>
                  <select
                    value={itemperpage}
                    onChange={(e) => setitemperpage(e.target.value)}
                    className="border rounded-md pl-2 py-2 w-16 border-custom-bg"
                  >
                    <option disabled>0</option>
                    {Array.from({ length: 10 }, (_, i = 1) => i + 1).map(
                      (number) => (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      )
                    )}
                  </select>
                </div>{" "}
                <div className="text-custom-bg mt-2">entries</div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <button
                onClick={OpenBadgeModle}
                className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <img src="/plus.png" alt="Add Company" className="w-4 h-4" />
                Add Model
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>


                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Make
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Model
                    </th>

                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Car Active
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {currentRecords.map((item) => (
                    <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.makemodel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <img src="/edit.png" alt="delete" className="w-6" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img src="/trash.png" alt="delete" className="w-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center text-center mt-4 gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span
                className={`px-3 py-1 mx-1 rounded ${currentPage
                    ? "bg-custom-bg text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                  }`}
              >
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddCarModel
        isOpen={isOpenBadge}
        onClose={OpenBadgeModle}
        fetchData={fetchData}
      />
      <UpdateCarModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        updateid={selectedUserId}
      />
    </>
  );
};

export default Page;
