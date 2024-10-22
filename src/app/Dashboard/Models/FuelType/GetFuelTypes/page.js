"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddFuelTypeModel from "../AddFuelType/AddFuelTypeModel";
import UpdateFuelTypeModel from "../UpdateFuelType/UpdateFuelType";
import axios from "axios";
import { API_URL_FuelType } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetFueltype } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenPayment, setIsOpenPayment] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage =
      getCompanyName() || localStorage.getItem("companyname");
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      GetFueltype().then(({ result }) => {
        console.log(result);
        setData(result);
        setFilteredData(result);
      });
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
      const response = await axios.delete(`${API_URL_FuelType}/${id}`);
      const { data } = response;

      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Fuel deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the Fuel.");
      }
    } catch (error) {
      console.error("Error deleting Fuel:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Fuel. Please try again."
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
    setIsOpenVehcleUpdate(true);
  };

  if (!isMounted) {
    return null;
  }

  const OpenPaymentModle = () => {
    setIsOpenPayment(!isOpenPayment);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
  };

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
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenPaymentModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Fuel
                </button>
              </div>
            </div>

            {/* Custom Responsive Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full mt-4 bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">
                      Fuel Name
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      Fuel Description
                    </th>
                    {/* <th className="px-4 py-2 text-left text-gray-600">
                      Company
                    </th> */}
                    <th className="px-4 py-2 text-left text-gray-600">
                      Fuel Status
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row._id} className="border-t">
                      <td className="px-4 py-2">{row.name}</td>
                      <td className="px-4 py-2">{row.description}</td>
                      {/* <td className="px-4 py-2">{row.adminCompanyName}</td> */}
                      <td className="px-4 py-2">
                        {row.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(row._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
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
      <AddFuelTypeModel
        isOpen={isOpenPayment}
        onClose={OpenPaymentModle}
        fetchData={fetchData}
      />
      <UpdateFuelTypeModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        fuelid={selectedUserId}
      />
    </>
  );
};

export default Page;
