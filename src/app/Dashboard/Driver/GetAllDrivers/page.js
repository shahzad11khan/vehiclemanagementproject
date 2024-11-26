"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { MdCurrencyPound } from "react-icons/md";
import AddDriverModel from "../AddDriver/AddDriverModel";
import UpdateDriverModel from "../UpdateDriver/UpdateDriverModel";
import axios from "axios";
import { API_URL_Driver } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import Link from "next/link";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL_Driver}`);
      setDrivers(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching drivers.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Driver}/${id}`);
      const { data } = response;
      if (data.success) {
        setDrivers((prevData) => prevData.filter((item) => item._id !== id));
        toast.success(data.message);
      } else {
        toast.warn(data.message || "Failed to delete the driver.");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error(
        "An error occurred while deleting the driver. Please try again."
      );
    }
  };

  useEffect(() => {
    const filtered = drivers.filter((driver) => {
      const companyMatch =
        driver.adminCompanyName &&
        selectedCompanyName &&
        driver.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const nameMatch =
        driver.firstName &&
        driver.firstName.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && nameMatch;
    });
    setFilteredDrivers(filtered);
  }, [searchTerm, drivers, selectedCompanyName]);

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenDriverUpdate(true);
  };

  if (!isMounted) return null;

  const OpenDriverModel = () => {
    setIsOpenDriver(!isOpenDriver);
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return `${(dateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObject
      .getDate()
      .toString()
      .padStart(2, "0")}/${dateObject.getFullYear()}`;
  };

  // Pagination calculations
  const indexOfLastDriver = currentPage * itemperpage;
  const indexOfFirstDriver = indexOfLastDriver - itemperpage;
  const currentDrivers = filteredDrivers.slice(
    indexOfFirstDriver,
    indexOfLastDriver
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredDrivers.length / itemperpage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 w-[82%]">
          <div className="justify-between mx-auto items-center mt-3">
            <div className="flex justify-between">
              <div className="flex justify-center text-center gap-3">
                <div className="text-custom-bg mt-2">Show</div>
                <div>
                  <select
                    value={itemperpage}
                    onChange={(e) => setitemperpage(e.target.value)}
                    className="border rounded-md px-4 py-2 w-16 border-custom-bg"
                  >
                    <option value="">0</option>
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
                      placeholder="Search by email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border rounded-md px-4 py-2 w-64 border-custom-bg"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={OpenDriverModel}
                className="bg-custom-bg text-white px-5 py-2 rounded hover:bg-blue-600"
              >
                Add Driver
              </button>
            </div>

            <div className="mt-4">
              <table className="w-full border-collapse border border-gray-200 overflow-x-auto">
                <thead>
                  <tr className="">
                    <th className=" px-4 py-2 bg-custom-bg text-white text-sm">
                      Full Name
                    </th>
                    <th className="text-sm  px-4 py-2 text-white bg-custom-bg">
                      Driver Email
                    </th>
                    <th className="text-sm px-4 py-2 text-white bg-custom-bg">
                      Home Telephone
                    </th>
                    <th className=" text-sm  px-4 py-2 text-white bg-custom-bg">
                      Mobile Telephone
                    </th>
                    <th className=" text-sm  px-4 py-2 text-white bg-custom-bg">
                      License Number
                    </th>
                    <th className=" text-sm  px-4 py-2 text-white bg-custom-bg">
                      NI Number
                    </th>
                    <th className=" text-sm  px-4 py-2 text-white bg-custom-bg">
                      Badge Type
                    </th>
                    {/* <th className="border border-gray-200 px-4 py-2">
                      Payment Cycle
                    </th> */}
                    {/* <th className="border border-gray-200 px-4 py-2">
                      Payment
                    </th> */}
                    <th className="text-sm px-3 py-2 text-white bg-custom-bg">
                      Date Of Birth
                    </th>
                    {/* <th className="border border-gray-200 px-4 py-2">
                      Start Date
                    </th> */}
                    <th className=" text-sm  px-4 py-2 text-white bg-custom-bg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDrivers.map((driver) => (
                    <tr key={driver._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {driver.firstName} {driver.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 ">
                        {driver.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {driver.tel1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {driver.tel2}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {driver.licenseNumber}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {driver.niNumber}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {driver.badgeType}
                      </td>

                      <td className="border border-gray-300 px-3 py-2">
                        {formatDate(driver.dateOfBirth)}
                      </td>
                      <td className="border border-gray-300">
                        <div className="flex gap-2">
                          {/* <button className="text-blue-500 hover:text-blue-700">
                            <Link
                              passHref
                              href={`/Dashboard/Driver/MoreInfo/${driver._id}`}
                            >
                              <div className="flex items-center gap-3">
                                <MdCurrencyPound size={20} />
                              </div>
                            </Link>
                          </button> */}
                          <div className="relative group">
                            <button
                              onClick={() => handleEdit(driver._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <img src="/edit.png" alt="edit" />
                            </button>
                            {/* Tooltip */}
                            <div className="absolute  transform translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                              Edit
                            </div>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => handleDelete(driver._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <img src="/trash.png" alt="delete" />
                            </button>
                            {/* Tooltip */}
                            <div className="absolute left-10 transform -translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                              Delete
                            </div>
                          </div>
                          {/* <button
                            onClick={() => handleDelete(driver._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaCarAlt size={20} />
                          </button> */}
                          <div className="relative group">
                            <button className="text-blue-500 hover:text-blue-700">
                              <Link
                                passHref
                                href={`/Dashboard/Driver/CombineDriverAndVehicle/${driver._id}`}
                              >
                                <div className="flex items-center gap-3">
                                  <img src="/bcar.png" alt="info" />
                                </div>
                              </Link>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <nav>
                <ul className="flex items-center space-x-2">
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border rounded ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    >
                      Previous
                    </button>
                  </li>

                  {pageNumbers.map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 border rounded ${
                          currentPage === number
                            ? "bg-custom-bg text-white"
                            : "bg-white"
                        }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}

                  <li>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 border rounded ${
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

          {/* Modals for Add and Update Drivers */}
          <AddDriverModel
            isOpen={isOpenDriver}
            onClose={OpenDriverModel}
            fetchData={fetchData}
          />
          <UpdateDriverModel
            isOpen={isOpenDriverUpdate}
            onClose={() => setIsOpenDriverUpdate(false)}
            selectedUserId={selectedUserId}
            fetchDataa={fetchData}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
