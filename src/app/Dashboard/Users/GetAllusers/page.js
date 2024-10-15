"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AddUserModel from "../AddUser/AddUserModel";
import UpdateUserModel from "../UpdateUser/UpdateUserModel";
import axios from "axios";
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const columns = [
    "Username",
    "Email",
    "Company Name",
    "User Avatar",
    "User Active",
    "Role",
    "Created By",
    "Actions",
  ];

  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isOpenUserUpdate, setIsOpenUserUpdate] = useState(false);
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
      const response = await axios.get(`${API_URL_USER}`);
      setUsers(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenUserUpdate(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_USER}/${id}`);
      const data = response.data;

      if (data.success) {
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
      let companyMatch = ""; // Change `const` to `let` to allow reassignment

      // Check if item exists, has companyname, and matches the selectedCompanyName
      companyMatch =
        item &&
        item.companyname &&
        selectedCompanyName &&
        item.companyname.toLowerCase() === selectedCompanyName.toLowerCase()
          ? item // Assign item if it matches
          : ""; // Otherwise, set it to an empty string

      const usernameMatch =
        item &&
        item.username &&
        item.username.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);
  }, [searchTerm, users, selectedCompanyName]);

  const OpenUserModle = () => {
    setIsOpenUser(!isOpenUser);
  };

  const OpenUserUpdateModle = () => {
    setIsOpenUserUpdate(!isOpenUserUpdate);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 w-[82%]">
          <div className="justify-between mx-auto items-center border-2 mt-3 p-4">
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
            <div className="w-full overflow-x-auto mt-4 ">
              <table className="w-11/12 border-collapse border border-gray-200 overflow-x-scroll">
                <thead>
                  <tr className="bg-gray-200">
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="py-2 px-4 border-b text-left text-gray-600"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{user.username}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.companyname}</td>
                      <td className="py-2 px-4 border-b">
                        <img
                          src={user.useravatar}
                          alt="User Avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.isActive ? (
                          <FaCheckCircle
                            className="text-green-500"
                            title="Active"
                          />
                        ) : (
                          <FaTimesCircle
                            className="text-red-500"
                            title="Inactive"
                          />
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">{user.role}</td>
                      <td className="py-2 px-4 border-b">
                        {user.adminCreatedBy || "By Self"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
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
      <AddUserModel
        isOpen={isOpenUser}
        onClose={OpenUserModle}
        fetchData={fetchData}
      />
      <UpdateUserModel
        isOpen={isOpenUserUpdate}
        onClose={OpenUserUpdateModle}
        userId={selectedUserId}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
