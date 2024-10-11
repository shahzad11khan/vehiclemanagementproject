"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddFirmModel from "../AddFirm/AddFirmModel";
import UpdateFirmModel from "../UpdateFirm/UpdateFirmModel";
import { API_URL_Firm } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetFirm } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";

const Page = () => {
  const [data, setData] = useState([]); // State to hold fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenFirm, setIsOpenFirm] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const { result } = await GetFirm();
      console.log(result);
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data to an empty array on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting ID:", id);
    try {
      const response = await axios.delete(`${API_URL_Firm}/${id}`);
      const { data } = response;
      console.log("Response Data:", data);

      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Enquiry deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the Enquiry.");
      }
    } catch (error) {
      console.error("Error deleting Enquiry:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Supplier. Please try again."
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

  const handleEdit = (id) => {
    // toast.info(`Edit item with ID: ${id}`);
    setSelectedUserId(id);
    setIsOpenDriverUpdate(true);
    OpenDriverUpdateModle();
  };

  if (!isMounted) {
    return null;
  }

  const OpenFirmModle = () => {
    setIsOpenFirm(!isOpenFirm);
  };

  const OpenDriverUpdateModle = () => {
    setIsOpenDriverUpdate(!isOpenDriverUpdate);
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 ">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenFirmModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Firm
                </button>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">
                      Firm Name
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Firm Description
                    </th>
                    {/* <th className="border border-gray-300 p-2 text-left">
                      Company
                    </th> */}
                    <th className="border border-gray-300 p-2 text-left">
                      Firm Status
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{row.name}</td>
                      <td className="border border-gray-300 p-2">
                        {row.description}
                      </td>
                      {/* <td className="border border-gray-300 p-2">
                        {row.adminCompanyName}
                      </td> */}
                      <td className="border border-gray-300 p-2">
                        {row.isActive ? "Active" : "InActive"}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(row._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddFirmModel
        isOpen={isOpenFirm}
        onClose={OpenFirmModle}
        fetchData={fetchData}
      />
      <UpdateFirmModel
        isOpen={isOpenDriverUpdate}
        onClose={OpenDriverUpdateModle}
        firmId={selectedUserId}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
