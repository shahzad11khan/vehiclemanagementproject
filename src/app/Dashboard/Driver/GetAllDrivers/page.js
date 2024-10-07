"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa"; // Added FaEye for the preview button
import AddDriverModel from "../AddDriver/AddDriverModel";
import UpdateDriverModel from "../UpdateDriver/UpdateDriverModel";
import DataTableComponent from "../../Components/CustomDataTable";
import axios from "axios";
import { API_URL_Driver } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const columns = [
    {
      name: "Full Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Driver email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Home Telephone",
      selector: (row) => row.tel1,
      sortable: true,
    },
    {
      name: "Mobile Telephone",
      selector: (row) => row.tel2,
      sortable: true,
    },
    {
      name: "Driver licenseNumber",
      selector: (row) => row.licenseNumber,
      sortable: true,
    },
    {
      name: "Driver niNumber",
      selector: (row) => row.niNumber,
      sortable: true,
    },

    {
      name: "Driver badgeType",
      selector: (row) => row.badgeType,
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row._id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          {/* <button
            onClick={() => handlePreview(row._id)}
            className="text-green-500 hover:text-green-700"
          >
            <FaEye />
          </button> */}
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
  const [driver, setDriver] = useState([]); // For storing fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

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
      const response = await axios.get(`${API_URL_Driver}`);
      console.log(response.data);
      setDriver(response.data.result); // Assuming the API returns an array of users
      setFilteredData(response.data.result); // Initialize filteredData with full user list
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDelete = async (id) => {
    console.log("Deleting ID:", id); // Log the ID to be deleted
    try {
      const response = await axios.delete(`${API_URL_Driver}/${id}`);
      const { data } = response; // Destructure data from response

      console.log("Response Data:", data); // Log the response data

      if (data.success) {
        // Check the status code or adjust based on your API
        // Remove the deleted item from state
        setDriver((prevData) => prevData.filter((item) => item._id !== id));
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
    const filtered = driver.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        selectedCompanyName &&
        item.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const usernameMatch =
        item &&
        item.firstName &&
        item.firstName.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered); // Update filtered data state
  }, [searchTerm, driver, selectedCompanyName]);

  const handleEdit = (id) => {
    toast.info(`Edit item with ID: ${id}`);
    setSelectedUserId(id); // Store the selected user ID
    setIsOpenDriverUpdate(true); // Open the modal
    OpenDriverUpdateModle();
  };

  // const handlePreview = (id) => {
  //   toast.info(`Preview driver with ID: ${id}`);
  //   // Implement your preview logic here
  // };

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenDriverModle = () => {
    setIsOpenDriver(!isOpenDriver);
  };
  const OpenDriverUpdateModle = () => {
    setIsOpenDriverUpdate(!isOpenDriverUpdate);
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-[78%]">
            <div className="flex justify-between">
              {/* Search Input */}
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by full name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64" // Tailwind CSS classes for input
                />
              </div>
              {/* Add Driver Button */}
              <div className="justify-end">
                <button
                  onClick={OpenDriverModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Driver
                </button>
              </div>
            </div>
            <div className="">
              <DataTableComponent
                title="Driver List"
                columns={columns}
                data={filteredData}
                pagination
              />
            </div>
          </div>
        </div>
      </div>
      <AddDriverModel
        isOpen={isOpenDriver}
        onClose={OpenDriverModle}
        fetchData={fetchData}
      />
      <UpdateDriverModel
        isOpen={isOpenDriverUpdate}
        onClose={OpenDriverUpdateModle} // Function to close the modal
        userId={selectedUserId} // Pass the selected ID to the modal
        fetchDataa={fetchData}
      />{" "}
    </>
  );
};

export default Page;
