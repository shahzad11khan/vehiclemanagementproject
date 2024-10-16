"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddMoreInfoModal from "../AddMoreInfoModal/AddMoreInfoModal";
import { API_URL_DriverMoreInfo } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";

const Page = ({ params }) => {
  const id = params.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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
      const response = await axios.get(`${API_URL_DriverMoreInfo}?id=${id}`);
      const { data } = response;

      if (data?.Result && Array.isArray(data.Result)) {
        setData(data.Result);
      } else {
        setData([]); // Handle the case where there's no result
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  // Handle deletion of a title
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_DriverMoreInfo}/${id}`);
      const { success, message } = response.data;

      if (success) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(message);
      } else {
        toast.warn(message);
      }
    } catch (error) {
      console.error("Error deleting title:", error);
      toast.error("Failed to delete title");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        selectedCompanyName &&
        item.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const usernameMatch =
        item.vehicle &&
        item.vehicle.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch; // Return true if both match
    });

    setFilteredData(filtered);
  }, [searchTerm, data, selectedCompanyName]);

  // Toggle the title modal
  const OpenDriverModel = () => {
    setSelectedUserId(id);
    setIsOpenDriver(!isOpenDriver);
  };

  // Ensure client-side rendering only
  if (!isMounted) return null;

  // Calculate totals for calculation, subtractcalculation, and remaining
  const totalCalculation = filteredData.reduce(
    (total, row) => total + (parseFloat(row.calculation) || 0),
    0
  );
  const totalSubtractCalculation = filteredData.reduce(
    (total, row) => total + (parseFloat(row.subtractcalculation) || 0),
    0
  );
  const totalRemaining = filteredData.reduce(
    (total, row) => total + (parseFloat(row.remaining) || 0),
    0
  );
  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    return `${(dateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObject
      .getDate()
      .toString()
      .padStart(2, "0")}/${dateObject.getFullYear()}`;
  }
  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between items-center border-2 mt-3">
            <div className="flex justify-between">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-4 py-2 w-64"
              />
              <button
                onClick={OpenDriverModel}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Driver Info
              </button>
            </div>

            {/* Responsive Table */}
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Vehicle
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Start Date
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Pay From
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Submitted Date
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Pay To
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Remaining Pay
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((row) => (
                        <tr key={row._id} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b border-gray-200">
                            {row.vehicle}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {formatDate(row.startDate)}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {row.calculation}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {formatDate(row.endDate)}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {row.subtractcalculation}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            {row.remaining}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200">
                            <button
                              onClick={() => handleDelete(row._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-2 px-4 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                    {/* Total Row */}
                    {filteredData.length > 0 && (
                      <tr className="font-bold">
                        <td className="py-2 px-4 border-b border-gray-200">
                          Total
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {totalCalculation}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {totalSubtractCalculation}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {totalRemaining}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMoreInfoModal
        isOpen={isOpenDriver}
        selectedUserId={selectedUserId}
        onClose={OpenDriverModel}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
