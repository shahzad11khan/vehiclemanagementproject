"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AddUserModel from "../AddUser/AddUserModel";
import UpdateUserModel from "../UpdateUser/UpdateUserModel";
import axios from "axios";
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
import {
  getCompanyName,
  getsuperadmincompanyname,
  getUserRole,
} from "@/utils/storageUtils";

const Page = () => {
  const columns = [
    "Username",
    "Email",
    "User Avatar",
    "User Active",
    "Role",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [itemperpage, setitemperpage] = useState(5);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage =
      getCompanyName() || getsuperadmincompanyname();
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
    const userrole = getUserRole();
    const filtered = users.filter((item) => {
      if (userrole === "superadmin") {
        return users;
      }
      let companyMatch =
        item &&
        item.companyname &&
        selectedCompanyName &&
        item.companyname.toLowerCase() === selectedCompanyName.toLowerCase();
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

  const indexOfLastUser = currentPage * itemperpage;
  const indexOfFirstUser = indexOfLastUser - itemperpage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                      placeholder="Search by email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border rounded-md px-4 py-2 w-64 border-custom-bg"
                    />
                  </div>
                </div>
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenUserModle}
                  className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </div>
            <div className="w-full overflow-x-auto mt-4 ">
              <table className="w-full border-collapse border border-gray-200 overflow-x-scroll">
                <thead>
                  <tr className="">
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="py-2 px-4 border-b text-left text-white bg-custom-bg"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers
                    .filter((user) => user.username !== "superadmin")
                    .map((user) => (
                      <tr key={user._id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{user.username}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <img src="/edit.png" alt="edit" />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <img src="/trash.png" alt="delete" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-l hover:bg-gray-300"
              >
                Previous
              </button>
              <span
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage
                    ? "bg-custom-bg text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-r hover:bg-gray-300"
              >
                Next
              </button>
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
