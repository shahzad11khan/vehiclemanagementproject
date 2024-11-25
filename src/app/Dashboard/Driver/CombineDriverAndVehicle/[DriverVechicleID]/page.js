"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddDriverAndVehicleModel from "../AddDriverAndVehicleModel/AddDriverAndVehicleModel";
import UpdateCombineDriverAndVehicle from "../UpdateCombineDriverAndVehicle/UpdateCombineDriverAndVehicle";
import { API_URL_Driver_Vehicle_Allotment } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import Link from "next/link";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center mt-3 w-full">
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
                      placeholder="Search by Driver Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border rounded-md px-4 py-2 w-64 border-custom-bg"
                    />
                  </div>
                </div>
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenAddDriverModal}
                  className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Car Allotment
                </button>
              </div>
            </div>
            <div className="overflow-x-auto mt-4">
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
                            <img src="/edit.png" alt="edit" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <img src="/trash.png" alt="delete" />
                          </button>
                          <Link
                            passHref
                            href={`/Dashboard/Driver/MoreInfo/${item.driverId}`}
                          >
                            <button className="text-blue-500 hover:text-blue-700">
                              <img src="/info.png" alt="delete" />
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
