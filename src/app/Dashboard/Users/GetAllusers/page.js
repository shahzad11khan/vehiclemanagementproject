"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import AddUserModel from "../AddUser/AddUserModel";
import DataTableComponent from "../../Components/CustomDataTable";
import axios from "axios";
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";

const Page = () => {
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
      name: "Company Avatar",
      selector: (row) => row.companyavatar, // This will be used for sorting, but not directly for display
      cell: (row) => (
        <img
          src={row.companyavatar} // Make sure the URL is valid
          alt="User Avatar"
          className="h-10 w-10 rounded-full" // Add styling as needed
        />
      ),
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
      selector: (row) => row.adminCreatedBy || "By Self", // Fallback to "By Self" if adminCreatedBy is falsy
      sortable: true,
      cell: (row) => (
        <span>{row.adminCreatedBy ? row.adminCreatedBy : "By Self"}</span>
      ),
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
          <button
            onClick={() => handlePreview(row._id)}
            className="text-green-500 hover:text-green-700"
          >
            <FaEye />
          </button>
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

  useEffect(() => {
    setIsMounted(true);
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
    toast.info(`Edit item with ID: ${id}`);
  };

  const handlePreview = (id) => {
    toast.info(`Preview item with ID: ${id}`);
  };

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
        // console.error(data.message);
        toast.warn(data.message);
      }
    } catch (error) {
      console.error("Error deleting title:", error);
    }
  };
  useEffect(() => {
    const filtered = users.filter((item) => {
      // Check if item and item.title are defined before calling toLowerCase
      return (
        item &&
        item.username &&
        item.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, users]); // Filter when search term or data changes

  const OpenUserModle = () => {
    setIsOpenUser(!isOpenUser);
  };
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 ">
          <div className="justify-between items-center border-2 mt-3">
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
            <div className="w-[1050px]">
              <DataTableComponent
                title="User List"
                columns={columns}
                data={filteredData}
                pagination
              />
            </div>
          </div>
        </div>
      </div>
      <AddUserModel isOpen={isOpenUser} onClose={OpenUserModle} />
    </>
  );
};

export default Page;
