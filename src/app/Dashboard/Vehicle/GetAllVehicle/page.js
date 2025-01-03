"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddVehicleModel from "../AddVehicle/AddVehicleModel";
import UpdateVehicleModel from "../UpdateVehicleModel/UpdateVehicleModel";
import axios from "axios";
import { API_URL_Vehicle } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import Link from "next/link";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import DeleteModal from "../../Components/DeleteModal";
import  BackButton  from "../../Components/BackButton";


const Page = () => {
  const router = useRouter();
  const [vehicle, setVehicle] = useState([]); // For storing fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenVehicle, setIsOpenVehicle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL_Vehicle}`);
      setVehicle(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const isopendeletemodel = (id) => {
    setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Vehicle}/${id}`);
      const { data } = response;
      if (data.success) {
        setVehicle((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        // toast.success(data.message);
      } else {
        toast.warn(data.message || "Failed to delete the vehicle.");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error(
        "An error occurred while deleting the vehicle. Please try again."
      );
    }
  };

  useEffect(() => {
    const filtered = vehicle.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        selectedCompanyName &&
        item.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const usernameMatch =
        item &&
        item.manufacturer &&
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, vehicle, selectedCompanyName]);

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenVehcleUpdate(true);
  };

  if (!isMounted) {
    return null;
  }

  const OpenVehicleModle = () => {
    setIsOpenVehicle(!isOpenVehicle);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * itemperpage;
  const indexOfFirstRecord = indexOfLastRecord - itemperpage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / itemperpage);
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 h-screen">
          <div className="mx-auto items-center  mt-3 w-full">
            <div className="flex justify-between">
              <div className="flex justify-center text-center gap-3">
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
                </div>
                <div className="flex justify-center text-center gap-3">
                  <div className="text-custom-bg mt-2">entries</div>
                  <div>
                    <input
                      type="text"
                      placeholder="Search by Manufacturer"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border rounded-md px-4 py-2 w-64 border-custom-bg"
                    />
                  </div>
                </div>
              </div>
              <div className="justify-end">
                <div className="flex gap-2">
                <BackButton/>

                <button
                  onClick={OpenVehicleModle}
                  className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <img src="/plus.png" alt="Add Company" className="w-4 h-4" />
                  Add Vehicle
                </button>
                </div>
              </div>
            </div>

            <div className="">
              <table className="min-w-full border-collapse border border-gray-300 mt-4 overflow-x-auto ">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Manufacturer
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Model
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Vehicle Status
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Year
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Type
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Engine Type
                    </th>
                    {/* <th className="px-4 py-2 bg-custom-bg text-white text-sm">
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
                <tbody>
                  {currentRecords.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2">{row.manufacturer}</td>
                      <td className="px-4 py-2">{row.model}</td>
                      <td className="px-4 py-2">{row.vehicleStatus}</td>
                      <td className="px-4 py-2">{row.year}</td>
                      <td className="px-4 py-2">{row.type}</td>
                      <td className="px-4 py-2">{row.engineType}</td>
                      {/* <td className="px-4 py-2">{row.adminCompanyName}</td> */}
                      <td className="">
                        <span className="bg-gray-400  px-4 py-2 rounded-3xl text-sm">
                          {row.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 relative">
                        <div className="flex gap-2">
                          <div className="flex gap-2">
                            {/* Edit Button with Tooltip */}
                            <div className="relative group">
                              <button
                                onClick={() => handleEdit(row._id)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <img src="/edit.png" alt="edit" className="w-6" />
                              </button>
                              {/* Tooltip */}
                              <div className="absolute  transform translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                Edit
                              </div>
                            </div>

                            {/* Delete Button with Tooltip */}
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

                          {/* Button to toggle dropdown */}
                          <button
                            onClick={() => toggleDropdown(row._id)}
                            className="text-gray-500 hover:text-gray-700 ml-5 underline"
                          >
                            Reports
                          </button>
                        </div>

                        {/* Dropdown menu */}
                        {openDropdownId === row._id && (
                          <div className="absolute top-10 left-0 bg-white border border-gray-200 shadow-lg rounded-md py-1 w-[170px] z-50">
                            <div className="px-4 py-2 hover:bg-gray-300">
                              <Link
                                href={`/Dashboard/Vehicle/VehicleReports/${row._id}`}
                                className="bg-transparent"
                              >
                                Car Details
                              </Link>
                            </div>
                            <div className="px-4 py-2 hover:bg-gray-300">
                              <Link
                                href={`/Dashboard/Vehicle/AddMaintenanceReport/${row._id}`}
                                className="bg-transparent"
                              >
                                Maintenance Report
                              </Link>
                            </div>
                            <div className="px-4 py-2 hover:bg-gray-300">
                              <Link
                                href={`/Dashboard/Vehicle/AddMOTReport/${row._id}`}
                                className="bg-transparent"
                              >
                                MOT Report
                              </Link>
                            </div>
                            <div className="px-4 py-2 hover:bg-gray-300">
                              <Link
                                href={`/Dashboard/Vehicle/AddServiceReport/${row._id}`}
                                className="bg-transparent"
                              >
                                Service Report
                              </Link>
                            </div>
                            <div className="px-4 py-2 hover:bg-gray-300">
                              <Link
                                href={`/Dashboard/Vehicle/AddRoadTaxReport/${row._id}`}
                                className="bg-transparent"
                              >
                                Road Tax Report
                              </Link>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center text-center mt-4 gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span
                className={`px-3 py-1 flex items-center justify-center mx-1 rounded ${
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
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddVehicleModel
        isOpen={isOpenVehicle}
        onClose={OpenVehicleModle}
        fetchData={fetchData}
      />
      <UpdateVehicleModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        vehicleId={selectedUserId}
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
