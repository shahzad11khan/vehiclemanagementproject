"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddFirmModel from "../AddFirm/AddFirmModel";
import UpdateFirmModel from "../UpdateFirm/UpdateFirmModel";
import { API_URL_Firm } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetFirm } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";
import DeleteModal from "@/app/Dashboard/Components/DeleteModal";

const Page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenFirm, setIsOpenFirm] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const companyNameFromStorage = getCompanyName(); // Get company name from storage
      const { result } = await GetFirm(); // Fetch the data
      console.log(result);
  
      // Filter the data based on company name and username (if necessary)
      const filtered = result.filter((item) => {
        // Check if the company name matches (case-insensitive)
        if (item.adminCompanyName.toLowerCase() === companyNameFromStorage.toLowerCase()) {
          return true;
        }
      });
  
      // Set the filtered data to both `data` and `filteredData`
      setData(filtered);
      setFilteredData(filtered);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setFilteredData([]); // Optionally clear filtered data in case of error
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const isopendeletemodel = (id) => {
    setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Firm}/${id}`);
      const { data } = response;
      console.log("Response Data:", data);

      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        // toast.success(data.message || "Enquiry deleted successfully.");
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
                <div className="text-custom-bg mt-2">Entries</div>
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenFirmModle}
                  className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600  flex items-center justify-center gap-2"
                >
                  <img src="/plus.png" alt="Add Company" className="w-4 h-4" />
                  Add Firm
                </button>
              </div>
            </div>

            <div className=" mt-4">
              <table className="min-w-full border-collapse border border-gray-200 overflow-x-auto">
                <thead>
                  <tr className="">
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Firm Name
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Firm Description
                    </th>

                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Status
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50 text-center">
                      <td className="px-4 py-2">{row.name}</td>
                      <td className="px-4 py-2">{row.description}</td>

                      <td className="px-4 py-2">
                        {row.isActive ? "Active" : "InActive"}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2 justify-center">
                          <div className="relative group">
                            <button
                              onClick={() => handleEdit(row._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <img src="/edit.png" alt="edit" className="w-6"/>
                            </button>
                            {/* Tooltip */}
                            <div className="absolute  transform translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                              Edit
                            </div>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => isopendeletemodel(row._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <img src="/trash.png" alt="delete" className="w-6" />
                            </button>
                            {/* Tooltip */}
                            <div className="absolute left-10 transform -translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                              Delete
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center mt-4 gap-1">
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
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        Id={isDeleteModalOpenId}
      />
    </>
  );
};

export default Page;
