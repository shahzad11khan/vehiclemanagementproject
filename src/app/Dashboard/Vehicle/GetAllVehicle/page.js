"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AddVehicleModel from "../AddVehicle/AddVehicleModel";
import axios from "axios";
import { API_URL_Vehicle } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  // Updated columns with the required fields
  const columns = [
    {
      name: "Manufacturer",
      selector: (row) => row.manufacturer,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "year",
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: "type",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "engineType",
      selector: (row) => row.engineType,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row) => row.adminCompanyName,
      sortable: true,
    },
    {
      name: "Active",
      selector: (row) => (row.active ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {/* Preview button */}
          <button
            onClick={() => handlePreview(row._id)}
            className="text-green-500 hover:text-green-700"
          >
            <FaEye />
          </button>
          {/* Edit button */}
          <button
            onClick={() => handleEdit(row._id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          {/* Delete button */}
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ),
      allowOverflow: true,
      button: true,
    },
  ];

  // State for the search term
  // State for the search term
  const [vehicle, setVehicle] = useState([]); // For storing fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenVehicle, setIsOpenVehicle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName(); // Get company name from localStorage
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage); // Set the selected company name
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL_Vehicle}`);
      console.log(response.data);
      setVehicle(response.data.result); // Assuming the API returns an array of users
      setFilteredData(response.data.result); // Initialize filteredData with full user list
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // delete
  const handleDelete = async (id) => {
    console.log("Deleting ID:", id); // Log the ID to be deleted
    try {
      const response = await axios.delete(`${API_URL_Vehicle}/${id}`);
      const { data } = response; // Destructure data from response

      console.log("Response Data:", data); // Log the response data

      if (data.success) {
        // Check the status code or adjust based on your API
        // Remove the deleted item from state
        setVehicle((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message); // Show success message
      } else {
        // If the success condition is not met
        toast.warn(data.message || "Failed to delete the driver."); // Show warning message
      }
    } catch (error) {
      console.error("Error deleting driver:", error); // Log the error

      // Show a user-friendly error message
      toast.error(
        "An error occurred while deleting the driver. Please try again."
      );
    }
  };

  // Filter data based on search term and selected company
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
    setFilteredData(filtered); // Update filtered data state
  }, [searchTerm, vehicle, selectedCompanyName]);

  const handleEdit = (id) => {
    toast.info(`Edit vehicle with ID: ${id}`);
    // Implement your edit logic here
  };

  const handlePreview = (id) => {
    toast.info(`Preview vehicle with ID: ${id}`);
    // Implement your preview logic here
  };

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenVehicleModle = () => {
    setIsOpenVehicle(!isOpenVehicle);
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 ">
          <div className="justify-between items-center border-2 mt-3">
            <div className="flex justify-between">
              {/* Search Input */}
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by model"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64" // Tailwind CSS classes for input
                />
              </div>
              {/* Add Vehicle Button */}
              <div className="justify-end">
                <button
                  onClick={OpenVehicleModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Vehicle
                </button>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              title="Vehicles List"
              columns={columns}
              data={filteredData} // Use filtered data
              pagination
            />
          </div>
        </div>
      </div>
      <AddVehicleModel
        isOpen={isOpenVehicle}
        onClose={OpenVehicleModle}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
