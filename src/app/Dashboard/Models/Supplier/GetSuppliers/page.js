"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddSupplierModel from "../AddSupplier/AddSupplierModel";
import UpdateSupplierModel from "../UpdateSupplier/UpdateSupplierModel";
import axios from "axios";
import { API_URL_Supplier } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetSupplier } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const [data, setData] = useState([]); // State to hold fetched data
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenSupplier, setIsOpenSupplier] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName(); // Get company name from localStorage
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage); // Set the selected company name
    }
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {
      GetSupplier().then(({ result }) => {
        console.log(result);
        setData(result); // Set the fetched data
        setFilteredData(result);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data to an empty array on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting ID:", id); // Log the ID to be deleted
    try {
      const response = await axios.delete(`${API_URL_Supplier}/${id}`);
      const { data } = response; // Destructure data from response

      console.log("Response Data:", data); // Log the response data

      if (data.status === 200) {
        // If the deletion was successful, update the state
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Supplier deleted successfully."); // Show success message
      } else {
        toast.warn(data.message || "Failed to delete the Supplier."); // Show warning message
      }
    } catch (error) {
      console.error("Error deleting Supplier:", error); // Log the error

      // Show a user-friendly error message
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Supplier. Please try again."
      );
    }
  };

  // Filter data based on search term and selected company
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
    setFilteredData(filtered); // Update filtered data state
  }, [searchTerm, data, selectedCompanyName]);

  const OpenSupplierModle = () => {
    setIsOpenSupplier(!isOpenSupplier);
  };

  const handleEdit = (id) => {
    // alert(id);
    setSelectedUserId(id);
    setIsOpenVehcleUpdate(true);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
  };

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 ">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between mb-4">
              {/* Search Input */}
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64" // Tailwind CSS classes for input
                />
              </div>
              {/* Add User Button */}
              <div className="justify-end">
                <button
                  onClick={OpenSupplierModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Supplier
                </button>
              </div>
            </div>

            {/* Tailwind CSS Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">
                      Supplier Name
                    </th>
                    <th className="py-2 px-4 border-b text-left">
                      Supplier Description
                    </th>
                    <th className="py-2 px-4 border-b text-left">Company</th>
                    <th className="py-2 px-4 border-b text-left">
                      Supplier Status
                    </th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{row.name}</td>
                      <td className="py-2 px-4 border-b">{row.description}</td>
                      <td className="py-2 px-4 border-b">
                        {row.adminCompanyName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {row.isActive ? "Active" : "InActive"}
                      </td>
                      <td className="py-2 px-4 border-b">
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
      <AddSupplierModel
        isOpen={isOpenSupplier}
        onClose={OpenSupplierModle}
        fetchData={fetchData}
      />

      <UpdateSupplierModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        supplierid={selectedUserId}
      />
    </>
  );
};

export default Page;
