"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEnquiryModel from "../AddEnquiry/AddEnquiryModel";
import UpdateEnquiryModel from "../UpdateEnquiry/UpdateEnquiryModel";
import { API_URL_Enquiry } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetEnquiry } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";
import DeleteModal from "@/app/Dashboard/Components/DeleteModal";

const Page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenEnquiry, setIsOpenEnquiry] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehicleUpdate] = useState(false);
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
      const { result } = await GetEnquiry();

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

  const isopendeletemodel = (id) => {
    setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Enquiry}/${id}`);
      const { data } = response;

      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        // toast.success(data.message || "Enquiry deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the enquiry.");
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the enquiry. Please try again."
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
        item.firstName &&
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);
  }, [searchTerm, data, selectedCompanyName]);

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenVehicleUpdate(true);
  };

  if (!isMounted) {
    return null;
  }

  const OpenEnquiryModel = () => {
    setIsOpenEnquiry(!isOpenEnquiry);
  };

  const OpenVehicleUpdateModel = () => {
    setIsOpenVehicleUpdate(!isOpenVehicleUpdate);
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
          <div className="justify-between mx-auto items-center mt-3 w-full">
            <div className="flex justify-between mb-4">
              <div className="md:flex gap-3 hidden items-center">
                <div className="font-sans font-medium text-sm">Show</div>
                <div>
                  <select
                    value={itemperpage}
                    onChange={(e) => {setitemperpage(e.target.value); setCurrentPage(1)}}
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
                <div className="font-sans font-medium text-sm">Entries</div>
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[230px] md:w-[260px]  border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                />
              </div>
              <button
                onClick={OpenEnquiryModel}
                className="w-[156px] md:w-auto font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2"
              >
                <img src="/plus.png" alt="Add Company" className="w-4 h-4" />
                Add Enquiry
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
              <table className="w-full bg-white border  table-fixed">
                <thead className="font-sans font-bold text-sm text-left">
                  <tr className="text-white bg-[#38384A]">
                    <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                      Enquiry Name
                    </th>
                    <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                      Enquiry Email
                    </th>

                    <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                      Enquiry Status
                    </th>
                    <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row) => (
                    <tr key={row._id} className="border-b text-center">
                      <td className=" py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                        {`${row.firstName} ${row.lastName}`}
                      </td>
                      <td className=" py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">{row.email}</td>

                      <td className=" py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                        {row.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className=" py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                      <div className="flex gap-4 justify-center">
                          <div className="relative group">
                            <button
                              onClick={() => handleEdit(row._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <img src="/edit.png" alt="edit" className="w-6" />
                            </button>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => isopendeletemodel(row._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <img src="/trash.png" alt="delete" className="w-6" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                  <nav>
                    <ul className="flex items-center gap-3">
                      {/* Previous Button */}
                      <li>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`h-8 px-2 border rounded-lg ${
                            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Pagination Logic */}
                      {totalPages > 1 && (
                        <>
                          {totalPages <= 3 ? (
                            // Show all pages if total pages are 3 or fewer
                            Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                              <li key={page}>
                                <button
                                  onClick={() => setCurrentPage(page)}
                                  className={`h-8 w-8 border rounded-lg ${
                                    currentPage === page ? "bg-custom-bg text-white" : "bg-white"
                                  }`}
                                >
                                  {page}
                                </button>
                              </li>
                            ))
                          ) : (
                            // Handle cases where total pages > 3
                            <>
                              {currentPage === 1 && (
                                <>
                                  <li>
                                    <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">1</button>
                                  </li>
                                  <li><span className="px-2">...</span></li>
                                  <li>
                                    <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
                                      {totalPages}
                                    </button>
                                  </li>
                                </>
                              )}
                              {currentPage > 1 && currentPage < totalPages && (
                                <>
                                  <li>
                                    <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                      {currentPage}
                                    </button>
                                  </li>
                                  <li><span className="px-2">...</span></li>
                                  <li>
                                    <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
                                      {totalPages}
                                    </button>
                                  </li>
                                </>
                              )}
                              {currentPage === totalPages && (
                                <li>
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    {totalPages}
                                  </button>
                                </li>
                              )}
                            </>
                          )}
                        </>
                      )}

                      {/* Next Button */}
                      <li>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`h-8 px-2 border rounded-lg ${
                            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
          </div>
        </div>
      </div>
      <AddEnquiryModel
        isOpen={isOpenEnquiry}
        onClose={OpenEnquiryModel}
        fetchData={fetchData}
      />
      <UpdateEnquiryModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModel}
        fetchData={fetchData}
        enquiryId={selectedUserId}
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
