"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdCurrencyPound } from "react-icons/md";
import AddDriverModel from "../AddDriver/AddDriverModel";
import UpdateDriverModel from "../UpdateDriver/UpdateDriverModel";
// import { API_URL_DriverMoreInfo } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";

import axios from "axios";
import { API_URL_Driver } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import Link from "next/link";

const Page = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

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
      const response = await axios.get(`${API_URL_Driver}`);
      setDrivers(response.data.result);
      setFilteredDrivers(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // console.log(id);
      // console.log(typeof id);
      const response = await axios.delete(`${API_URL_Driver}/${id}`);
      const { data } = response;
      if (data.success) {
        setDrivers((prevData) => prevData.filter((item) => item._id !== id));
        toast.success(data.message);
        // const moreInfoResponse = await axios.delete(
        //   `${API_URL_DriverMoreInfo}/${id}`
        // );
        // console.log(moreInfoResponse);
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

  if (!isMounted) {
    return null;
  }

  const OpenDriverModel = () => {
    setIsOpenDriver(!isOpenDriver);
  };

  const onGlobalFilterChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
        <div className="container mx-auto p-4 w-[82%]">
          <div className="justify-between mx-auto items-center border-2 mt-3 p-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <input
                  type="search"
                  onChange={onGlobalFilterChange}
                  placeholder="Search by full name"
                  className="border rounded px-4 py-2 w-full"
                />
              </div>

              <button
                onClick={OpenDriverModel}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Driver
              </button>
            </div>

            <div className="w-full overflow-x-auto mt-4 ">
              <table className="w-11/12 border-collapse border border-gray-200 overflow-x-scroll">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2">
                      Full Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Driver Email
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Home Telephone
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Mobile Telephone
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      License Number
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      NI Number
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Badge Type
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Payment Cycle
                    </th>
                    {/* <th className="border border-gray-200 px-4 py-2">
                      Driver Payment
                    </th> */}
                    <th className="border border-gray-200 px-4 py-2">
                      Payment
                    </th>
                    {/* <th className="border border-gray-200 px-4 py-2">calc</th> */}
                    <th className="border border-gray-200 px-4 py-2">
                      Date Of Birth
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Start Date
                    </th>

                    {/* <th className="border border-gray-200 px-4 py-2">
                      Calculation
                    </th> */}

                    <th className="border border-gray-200 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => (
                    <tr key={driver._id} className="hover:bg-gray-50">
                      <td className=" p-3">
                        {driver.firstName} {driver.lastName}
                      </td>
                      <td className="  p-3">{driver.email}</td>
                      <td className="  p-3">{driver.tel1}</td>
                      <td className="  p-3">{driver.tel2}</td>
                      <td className="  p-3">{driver.licenseNumber}</td>
                      <td className="  p-3">{driver.niNumber}</td>
                      <td className="  p-3">{driver.badgeType}</td>
                      <td className="  p-3">{driver.rentPaymentCycle}</td>
                      <td className="  p-3">£ {driver.pay}</td>
                      <td className="p-3">{formatDate(driver.dateOfBirth)}</td>
                      <td className="p-3">{formatDate(driver.startDate)}</td>

                      <td className="  p-3">
                        <div className="flex gap-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Link
                              passHref
                              href={`/Dashboard/Driver/MoreInfo/${driver._id}`}
                            >
                              <div className="flex items-center gap-3">
                                <MdCurrencyPound size={20} />
                              </div>
                            </Link>
                          </button>
                          <button
                            onClick={() => handleEdit(driver._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(driver._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddDriverModel
        isOpen={isOpenDriver}
        onClose={OpenDriverModel}
        fetchData={fetchData}
      />
      <UpdateDriverModel
        isOpen={isOpenDriverUpdate}
        onClose={() => setIsOpenDriverUpdate(false)}
        userId={selectedUserId}
        fetchDataa={fetchData}
      />
    </>
  );
};

export default Page;
