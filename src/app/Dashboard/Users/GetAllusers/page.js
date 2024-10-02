"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEdit,
  // FaEye,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import AddUserModel from "../AddUser/AddUserModel";
import UpdateUserModel from "../UpdateUser/UpdateUserModel";
import DataTableComponent from "../../Components/CustomDataTable";
import axios from "axios";
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils"; // Assuming you have this utility for getting company name
// import Image from "next/image";
// import { useRouter } from "next/navigation";

const Page = () => {
  // const router = useRouter();
  // columns
  const columns = [
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: "Company Name",
      selector: (row) => row.companyname,
      sortable: true,
    },

    {
      name: "User Avatar",
      selector: (row) => row.useravatar, // This will be used for sorting, but not directly for display
      cell: (row) => (
        <img
          src={row.useravatar} // Make sure the URL is valid
          alt="User Avatar"
          className="h-10 w-10 rounded-full" // Add styling as needed
          width={100}
          height={100}
        />
      ),
      sortable: true,
    },
    {
      name: "User Active",
      selector: (row) => row.isActive,
      cell: (row) => (
        <div>
          {row.isActive ? (
            <FaCheckCircle className="text-green-500" title="Active" />
          ) : (
            <FaTimesCircle className="text-red-500" title="Inactive" />
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.adminCreatedBy || "By Self",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row._id)} // Call handleEdit with ID
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
  // End columns
  const [users, setUsers] = useState([]); // For storing fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isOpenUserUpdate, setIsOpenUserUpdate] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName(); // Get the selected company name from localStorage
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage); // Set the selected company name
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL_USER}`);
      console.log(response.data);
      setUsers(response.data.result); // Assuming the API returns an array of users
      setFilteredData(response.data.result); // Initialize filteredData with full user list
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (id) => {
    // toast.info(`Edit item with ID: ${id}`);
    setSelectedUserId(id); // Store the selected user ID
    setIsOpenUserUpdate(true); // Open the modal
  };
  // const handlePreview = (id) => {
  //   toast.info(`Preview item with ID: ${id}`);
  // };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_USER}/${id}`);

      const data = response.data;
      console.log(data);

      if (data.success) {
        // Remove the deleted item from state
        setUsers((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message);
      } else {
        toast.warn(data.message);
      }
    } catch (error) {
      console.error("Error deleting title:", error);
    }
  };

  useEffect(() => {
    const filtered = users.filter((item) => {
      // Filter by company name
      const companyMatch =
        item &&
        item.companyname &&
        selectedCompanyName &&
        item.companyname.toLowerCase() === selectedCompanyName.toLowerCase();

      // Filter by search term (username)
      const usernameMatch =
        item &&
        item.username &&
        item.username.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);
  }, [searchTerm, users, selectedCompanyName]); // Filter when search term, data, or selected company changes

  const OpenUserModle = () => {
    setIsOpenUser(!isOpenUser);
  };
  // Function to toggle modal visibility
  const OpenUserUpdateModle = () => {
    setIsOpenUserUpdate(!isOpenUserUpdate); // Close the modal
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 overflow-hidden">
          <div className="justify-between items-center border-2 mt-3 w-[83%]">
            <div className="flex justify-between">
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by UserName"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenUserModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </div>
            <div>
              <DataTableComponent
                title="User List"
                columns={columns}
                data={filteredData}
                pagination
                className=" "
              />
            </div>
          </div>
        </div>
      </div>
      <AddUserModel isOpen={isOpenUser} onClose={OpenUserModle} />
      <UpdateUserModel
        isOpen={isOpenUserUpdate}
        onClose={OpenUserUpdateModle} // Function to close the modal
        userId={selectedUserId} // Pass the selected ID to the modal
      />{" "}
    </>
  );
};

export default Page;
