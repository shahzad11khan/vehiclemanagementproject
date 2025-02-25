"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddDriverAndVehicleModel from "../AddDriverAndVehicleModel/AddDriverAndVehicleModel";
import UpdateCombineDriverAndVehicle from "../UpdateCombineDriverAndVehicle/UpdateCombineDriverAndVehicle";
import { API_URL_Driver_Vehicle_Allotment,API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import Link from "next/link";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import BackButton from "../../../Components/BackButton";
import DeleteModal from "@/app/Dashboard/Components/DeleteModal";

const Page = ({ params }) => {
  const router = useRouter();
  const id = params.DriverVechicleID;
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenAddDriverModal, setIsOpenAddDriverModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [itemperpage, setitemperpage] = useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);
  

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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL_Driver_Vehicle_Allotment}/${id}`
      );
      setData(response.data.result || []);
      setFilteredData(response.data.result);
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
      const response = await axios.delete(
        `${API_URL_Driver_Vehicle_Allotment}/${id}`
      );
      console.log(response);
      const { data } = response;
      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Allotment deleted successfully.");
        // console.log("data",filteredData)
        const carId = filteredData.find((records) => records._id == id);
        // console.log("mydata",carId.vehicleId);
        const formDataupdate = new FormData();
        formDataupdate.append("vehicleStatus", "Standby");
        const updateResponse = await axios.put(
          `${API_URL_Vehicle}/${carId.vehicleId}`,
          formDataupdate, // Pass the FormData object as the request body
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(updateResponse);
      } else {
        toast.warn(data.message || "Failed to delete the allotment.");
      }
    } catch (error) {
      console.error("Error deleting allotment:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the allotment. Please try again."
      );
    }
  };

  useEffect(() => {
    const companyName = getCompanyName();
    const filtered = data.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        companyName &&
        item.adminCompanyName.toLowerCase() === companyName.toLowerCase();
      const usernameMatch =
        item.driverName &&
        item.driverName.toLowerCase().includes(searchTerm.toLowerCase());
      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);
  }, [searchTerm, data, selectedCompanyName]);

  const OpenAddDriverModal = () => {
    setSelectedUserId(id);
    setIsOpenAddDriverModal(!isOpenAddDriverModal);
  };

  const handleEdit = (idd) => {
    setSelectedUserId(idd);
    setIsOpenUpdateModal(true);
  };

  const OpenUpdateModal = () => {
    setIsOpenUpdateModal(!isOpenUpdateModal);
  };

  // Pagination calculations
  const indexOfLastDriver = currentPage * itemperpage;
  const indexOfFirstDriver = indexOfLastDriver - itemperpage;
  const currentDrivers = filteredData.slice(
    indexOfFirstDriver,
    indexOfLastDriver
  );

  console.log(currentDrivers);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers

  if (!isMounted) {
    return null;
  }

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
            Car Allotment
          </h1>
          <div className="py-5">
            <div className="drop-shadow-custom4">
              <div className="justify-between mx-auto items-center mt-3 w-full">
                <div className="flex justify-between w-full py-2 px-2">
                  <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                    <div className="flex justify-between gap-7 items-center">
                      {/* Show Entries Section */}
                      <div className="md:flex gap-3 hidden items-center">
                        <div className="font-sans font-medium text-sm">
                          Show
                        </div>
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
                            {Array.from(
                              { length: 10 },
                              (_, i = 1) => i + 1
                            ).map((number) => (
                              <option key={number} value={number}>
                                {number}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="font-sans font-medium text-sm">
                          Entries
                        </div>
                      </div>

                      {/* Search Section */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            src="/search.svg"
                            className="absolute left-3 top-2"
                            alt="Search Icon"
                          />
                          <input
                            type="text"
                            placeholder="Search by Driver Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Button Section */}
                    <div className="flex gap-2 ">
                      <BackButton />
                      <button
                        onClick={OpenAddDriverModal}
                        className="w-[132px] font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2 items-center justify-center"
                      >
                        <img src="/plus.svg" alt="Add Driver" />
                        Car Allotment
                      </button>
                    </div>
                  </div>
                </div>

                {/* <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Driver Name
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Vehicle Name
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Local Authority
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Start Date
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Payment Cycle
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Payment
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Status
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDrivers.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.driverName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.vehicle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.taxilocalauthority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.paymentcycle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.payment || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="bg-gray-400 px-1 py-1 border-2 rounded-2xl">
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap text-sm font-medium mx-auto">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <img src="/edit.png" alt="edit" className="w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <img
                              src="/trash.png"
                              alt="delete"
                              className="w-5"
                            />
                          </button>
                          <Link
                            passHref
                            href={`/Dashboard/Driver/MoreInfo/${item.vehicleId}`}
                          >
                            <button className="text-blue-500 hover:text-blue-700">
                              <img
                                src="/info.png"
                                alt="delete"
                                className="w-5"
                              />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full bg-white border table-auto">
                    <thead className="font-sans font-bold text-sm text-left">
                      <tr className="text-white bg-[#38384A]">
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Driver Name
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Vehicle Name
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Local Authority
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Start Date
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Payment Cycle
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Payment
                        </th>
                        {/* <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Status
                        </th> */}
                        <th className="py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-sans font-medium text-sm">
                      {currentDrivers.map((driver) => (
                        <tr key={driver._id} className="border-b">
                          <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                            {driver.driverName}
                          </td>
                          <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                            {driver.vehicle}
                          </td>
                          <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                            {driver.taxilocalauthority}
                          </td>
                          <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                            {driver.startDate}
                          </td>
                          <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                            {driver.paymentcycle}
                          </td>
                          <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                            {driver.payment || 0}
                          </td>
                          {/* <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                            {driver.status}
                          </td> */}

                          <td className="py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] whitespace-normal break-all overflow-hidden text-center">
                            <div className="flex gap-4 justify-center">
                              <button onClick={() => handleEdit(driver._id)}>
                                <img
                                  src="/edit.png"
                                  alt="edit"
                                  className="w-6"
                                />
                              </button>
                              <button
                                onClick={() => isopendeletemodel(driver._id)}
                              >
                                <img
                                  src="/trash.png"
                                  alt="delete"
                                  className="w-6"
                                />
                              </button>
                              <Link
                                passHref
                                href={`/Dashboard/Driver/MoreInfo/${driver.vehicleId}`}
                                className="flex items-center"
                              >
                                <button>
                                  <img
                                    src="/info.png"
                                    alt="info"
                                    className="w-6"
                                  />
                                </button>
                              </Link>
                            </div>
                          </td>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddDriverAndVehicleModel
        isOpen={isOpenAddDriverModal}
        onClose={OpenAddDriverModal}
        fetchData={fetchData}
        selectedUserId={selectedUserId}
      />
      <UpdateCombineDriverAndVehicle
        isOpen={isOpenUpdateModal}
        onClose={OpenUpdateModal}
        fetchData={fetchData}
        selectedUserId={selectedUserId}
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
