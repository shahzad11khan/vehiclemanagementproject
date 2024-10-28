"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosInformationCircle } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddDriverAndVehicleModel from "../AddDriverAndVehicleModel/AddDriverAndVehicleModel";
import UpdateCombineDriverAndVehicle from "../UpdateCombineDriverAndVehicle/UpdateCombineDriverAndVehicle";
import { API_URL_Driver_Vehicle_Allotment } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import Link from "next/link";

const Page = ({ params }) => {
  const id = params.DriverVechicleID;
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenAddDriverModal, setIsOpenAddDriverModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);

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
    setIsOpenAddDriverModal(!isOpenAddDriverModal);
  };

  const handleEdit = (idd) => {
    setSelectedUserId(idd);
    setIsOpenUpdateModal(true);
  };

  const OpenUpdateModal = () => {
    setIsOpenUpdateModal(!isOpenUpdateModal);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenAddDriverModal}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Car Allotment
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Local Authority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Cycle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
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
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium mx-auto">
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                          <Link
                            passHref
                            href={`/Dashboard/Driver/MoreInfo/${item._id}`}
                          >
                            <button className="text-blue-500 hover:text-blue-700">
                              <IoIosInformationCircle size={20} />
                            </button>
                          </Link>
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
    </>
  );
};

export default Page;
