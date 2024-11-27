"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);

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

  const totalPages = Math.ceil(filteredData.length / itemperpage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemperpage,
    currentPage * itemperpage
  );
  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center  mt-3 w-full">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <div className="text-custom-bg mt-2">Show</div>
                <div>
                  <select
                    value={itemperpage}
                    onChange={(e) => setitemperpage(e.target.value)}
                    className="border rounded-md px-4 py-2 w-16 border-custom-bg"
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
                  placeholder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              {/* Add User Button */}
              <div className="justify-end">
                <button
                  onClick={OpenInsuranceModel}
                  className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600  flex items-center justify-center gap-2"
                >
                  <img src="/plus.png" alt="Add Company" className="w-4 h-4" />
                  Add Insurance
                </button>
              </div>
            </div>

            {/* Tailwind CSS Table */}
            <div className="">
              <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Insurance
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Insurance Description
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th> */}
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Status
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {currentData.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.description}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {item.adminCompanyName}
                      </td> */}
                      <td className="px-4 py-2">
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-2 flex justify-center">
                        <div className="relative group">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <img src="/edit.png" alt="edit" />
                          </button>
                          {/* Tooltip */}
                          <div className="absolute  transform translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                            Edit
                          </div>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <img src="/trash.png" alt="delete" />
                          </button>
                          {/* Tooltip */}
                          <div className="absolute left-10 transform -translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                            Delete
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage
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
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
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
