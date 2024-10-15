"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";

import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
// import AddTitleModel from "../AddTitle/AddTitleModel";
import { GetTitle } from "../../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { API_URL_Title } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]); // State to hold fetched data
  const [filteredData, setFilteredData] = useState([]);
  // const [isOpenTitle, setIsOpenTitle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

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
      const { result } = await GetTitle(); // Fetch titles
      setData(result); // Set the fetched data
      setFilteredData(result); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data to an empty array on error
    }
  };

  // Handle deletion of a title
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Title}/${id}`);
      const { success, message } = response.data;

      if (success) {
        // Remove the deleted item from state
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
    fetchData(); // Fetch data on component mount
  }, []);

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

  // Toggle the title modal
  // const toggleTitleModal = () => {
  //   setIsOpenTitle((prev) => !prev);
  // };

  if (!isMounted) return null; // Render nothing until mounted

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
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-4 py-2 w-64"
              />
              <button
                // onClick={toggleTitleModal}
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
                        Title
                      </th>
                      {/* <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Company
                      </th> */}
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row) => (
                      <tr key={row._id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b border-gray-200">
                          {row.name}
                        </td>
                        {/* <td className="py-2 px-4 border-b border-gray-200">
                          {row.adminCompanyName}
                        </td> */}
                        <td className="py-2 px-4 border-b border-gray-200">
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="text-red-500 hover:text-red-700" />
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
      </div>
      {/* <AddTitleModel
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
      /> */}
    </>
  );
};

export default Page;
