"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddTransmissionModel from "../AddTransmission/AddTransmissionModel";
import UpdateTransmissionModel from "../UpdateTransmission/UpdateTransmissionModel";
import axios from "axios";
import { API_URL_Transmission } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetTransmissions } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenPayment, setIsOpenPayment] = useState(false);
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
      GetTransmissions().then(({ result }) => {
        setData(result);
        setFilteredData(result);
      });
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
      const response = await axios.delete(`${API_URL_Transmission}/${id}`);
      const { data } = response;
      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Transmission deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the Transmission.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Transmission. Please try again."
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
    setSelectedUserId(id);
    setIsOpenVehcleUpdate(true);
  };

  if (!isMounted) {
    return null;
  }

  const OpenPaymentModle = () => {
    setIsOpenPayment(!isOpenPayment);
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
                  onClick={OpenPaymentModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Transmission
                </button>
              </div>
            </div>

            {/* Tailwind CSS Responsive Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-left">
                    <th className="p-3 border">Transmission</th>
                    <th className="p-3 border">Description</th>
                    {/* <th className="p-3 border">Company</th> */}
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row._id} className="bg-white hover:bg-gray-100">
                        <td className="p-3 border">{row.name}</td>
                        <td className="p-3 border">{row.description}</td>
                        {/* <td className="p-3 border">{row.adminCompanyName}</td> */}
                        <td className="p-3 border">
                          {row.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="p-3 border">
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-3 text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddTransmissionModel
        isOpen={isOpenPayment}
        onClose={OpenPaymentModle}
        fetchData={fetchData}
      />
      <UpdateTransmissionModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        transmissionid={selectedUserId}
      />
    </>
  );
};

export default Page;
