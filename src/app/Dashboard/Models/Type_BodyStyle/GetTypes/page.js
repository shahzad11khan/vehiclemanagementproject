"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddTypeModel from "../AddType/AddTypeModel";
import UpdateTypeModel from "../UpdateType/UpdateTypeModel";
import axios from "axios";
import { API_URL_Type } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { Gettype } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  // State variables
  const [data, setData] = useState([]); // State to hold fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName(); // Get company name from localStorage
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage); // Set the selected company name
    }
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {
      Gettype().then(({ result }) => {
        setData(result); // Set the fetched data
        setFilteredData(result);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data to an empty array on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Type}/${id}`);
      const { data } = response; // Destructure data from response

      if (data.status === 200) {
        // If the deletion was successful, update the state
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Type deleted successfully."); // Show success message
      } else {
        // If the success condition is not met
        toast.warn(data.message || "Failed to delete the Type."); // Show warning message
      }
    } catch (error) {
      console.error("Error deleting Type:", error); // Log the error

      // Show a user-friendly error message
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Type. Please try again."
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
    setFilteredData(filtered); // Update filtered data state
  }, [searchTerm, data, selectedCompanyName]);

  const handleEdit = (id) => {
    setSelectedUserId(id); // Store the selected user ID
    setIsOpenVehcleUpdate(true); // Open the modal
  };

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenPaymentModle = () => {
    setIsOpenPayment(!isOpenPayment);
  };

  // Function to toggle modal visibility
  const OpenVehicleUpdateModle = () => {
    setIsOpenVehcleUpdate(!isOpenVehicleUpdate); // Close the modal
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
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
              {/* Add Type Button */}
              <div className="justify-end">
                <button
                  onClick={OpenPaymentModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Type
                </button>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-4 text-left border">Type Name</th>
                    <th className="py-3 px-4 text-left border">Description</th>
                    {/* <th className="py-3 px-4 text-left border">Company</th> */}
                    <th className="py-3 px-4 text-left border">Status</th>
                    <th className="py-3 px-4 text-left border">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr
                        key={row._id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-3 px-4 text-left border">
                          {row.name}
                        </td>
                        <td className="py-3 px-4 text-left border">
                          {row.description}
                        </td>
                        {/* <td className="py-3 px-4 text-left border">
                          {row.adminCompanyName}
                        </td> */}
                        <td className="py-3 px-4 text-left border">
                          {row.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="py-3 px-4 text-left border">
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
                      <td colSpan="5" className="py-3 px-4 text-center">
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
      <AddTypeModel
        isOpen={isOpenPayment}
        onClose={OpenPaymentModle}
        fetchData={fetchData}
      />
      <UpdateTypeModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        typeid={selectedUserId}
      />
    </>
  );
};

export default Page;
