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
// import BackButton from "../../Components/BackButton";

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

  console.log(vehicle);

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
    <div className="h-[100vh] overflow-hidden">
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div
          className="w-[80%] xl:w-[85%] h-screen flex flex-col justify-start overflow-y-auto pr-4"
          style={{
            height: "calc(100vh - 90px)",
          }}
        >
          <h1 className="text-[#313342] font-medium text-2xl py-5 underline decoration-[#AEADEB] underline-offset-8">
            Vehicle
          </h1>

          <div className="py-5">
            <div className="drop-shadow-custom4">
              <div className="flex justify-between w-full py-2 px-2">
                <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                  <div className="flex justify-between gap-7 items-center">
                    <div className="md:flex gap-3 hidden items-center">
                      <div className="font-sans font-medium text-sm">Show</div>
                      <div>
                        <select
                          value={itemperpage}
                          onChange={(e) => {
                            setitemperpage(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="rounded-lg w-12 px-1 h-8 bg-[#E0E0E0] focus:outline-none"
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
                      <div className="font-sans font-medium text-sm">
                        Entries
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src="/search.svg"
                          className="absolute left-3 top-2"
                          alt="Search Icon"
                        />
                        <input
                          type="text"
                          placeholder="Search by Manufacturer"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className=" w-[230px] md:w-[260px]  border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={OpenVehicleModle}
                      className="w-[132px] font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2 items-center justify-center"
                    >
                      <img src="/plus.svg" alt="Add Vehicle" />
                      Add Vehicle
                    </button>
                  </div>
                </div>
              </div>

              {/* table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full bg-white border table-auto">
                  <thead className="font-sans font-bold text-sm text-left">
                    <tr className="text-white bg-[#38384A]">
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Manufacturer
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Model
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Year
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Vehicle Status
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Type
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Engine Type
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Company
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[12.5%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Status
                      </th>
                      <th className="py-3 px-4 min-w-[180px] w-[180px] md:w-[12.5%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans font-medium text-sm">
                    {currentRecords.map((row) => (
                      <tr key={row._id} className="border-b relative">
                        <td className="py-3 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.manufacturer}
                        </td>
                        <td className="py-3 px-4 whitespace-normal text-center break-all overflow-hidden">
                          {row.model}
                        </td>
                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                          {row.year}
                        </td>
                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                          {row.vehicleStatus}
                        </td>
                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                          {row.type}
                        </td>
                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                          {row.engineType}
                        </td>
                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                          {row.adminCompanyName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-gray-400 px-4 py-2 rounded-3xl text-sm">
                            {row.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 relative">
                          <div className="flex gap-2 justify-center items-center">
                            <div className="relative group flex items-center justify-center">
                              <button
                                onClick={() => handleEdit(row._id)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <img
                                  src="/edit.png"
                                  alt="edit"
                                  className="w-6"
                                />
                              </button>
                              {/* <div className="absolute transform translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                Edit
                              </div> */}
                              
                            </div>
                              <div className="relative group flex items-center justify-center">
                              <button
                                onClick={() => toggleDropdown(row._id)}
                                className="text-gray-500 hover:text-gray-700 underline"
                                >
                               <img
                                    src="/Report.svg"
                                    alt="delete"
                                    className="w-6"
                                    />
                              </button>
                              </div>

                            <div className="relative group flex items-center justify-center">
                              <button
                                onClick={() => isopendeletemodel(row._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <img
                                  src="/trash.png"
                                  alt="delete"
                                  className="w-6"
                                />
                              </button>
                              {/* <div className="absolute left-10 transform -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                Delete
                              </div> */}
                            </div>

                          </div>

                          
                        </td>
                        {openDropdownId === row._id && (
                            <div className="fixed  right-24   bg-white border border-gray-200 shadow-lg rounded-md  w-[170px] z-50">
                              <div className="h-8 rounded-t-md">
                                <Link
                                  href={`/Dashboard/Vehicle/VehicleReports/${row._id}`}
                                  className="w-full px-2 rounded-t-md h-full flex justify-start items-center  hover:bg-[#313342] opacity-80 hover:text-white"
                                >
                                  Car Details
                                </Link>
                              </div>
                              <div className="h-8">
                                <Link
                                  href={`/Dashboard/Vehicle/AddMaintenanceReport/${row._id}`}
                                  className="w-full px-2 h-full flex justify-start items-center  hover:bg-[#313342] opacity-80 hover:text-white"
                                >
                                  Maintenance Report
                                </Link>
                              </div>
                              <div className="h-8">
                                <Link
                                  href={`/Dashboard/Vehicle/AddMOTReport/${row._id}`}
                                  className="w-full px-2 h-full flex justify-start items-center  hover:bg-[#313342] opacity-80 hover:text-white"
                                >
                                  MOT Report
                                </Link>
                              </div>
                              <div className="h-8">
                                <Link
                                  href={`/Dashboard/Vehicle/AddServiceReport/${row._id}`}
                                  className="w-full px-2 h-full flex justify-start items-center  hover:bg-[#313342] opacity-80 hover:text-white"
                                >
                                  Service Report
                                </Link>
                              </div>
                              <div className="h-8 rounded-b-md">
                                <Link
                                  href={`/Dashboard/Vehicle/AddRoadTaxReport/${row._id}`}
                                  className="w-full rounded-b-md px-2 h-full flex justify-start items-center  hover:bg-[#313342] opacity-80 hover:text-white"
                                >
                                  Road Tax Report
                                </Link>
                              </div>
                            </div>
                          )}
                         
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                <nav>
                  <ul className="flex items-center gap-3">
                    {/* Previous Button */}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`h-8 px-2 border rounded-lg ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-white"
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
                          Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                          ).map((page) => (
                            <li key={page}>
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 border rounded-lg ${
                                  currentPage === page
                                    ? "bg-custom-bg text-white"
                                    : "bg-white"
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
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    1
                                  </button>
                                </li>
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
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
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
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
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`h-8 px-2 border rounded-lg ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              {/* pagination ends here  */}
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
    </div>
  );
};

export default Page;
