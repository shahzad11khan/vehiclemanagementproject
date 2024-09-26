"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import AddUserModel from "../AddUser/AddUserModel";
import DataTableComponent from "../../Components/CustomDataTable";

const data = [
  {
    id: 1,
    fullName: "John Doe",
    username: "johndoe",
    accessLevel: "Admin",
    email: "john@example.com",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    username: "janesmith",
    accessLevel: "Editor",
    email: "jane@example.com",
  },
  {
    id: 3,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 4,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 5,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 6,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 7,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 8,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 9,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 10,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
  {
    id: 11,
    fullName: "Michael Johnson",
    username: "michaelj",
    accessLevel: "User",
    email: "michael@example.com",
  },
];

const columns = [
  {
    name: "Full Name",
    selector: (row) => row.fullName,
    sortable: true,
  },
  {
    name: "Username",
    selector: (row) => row.username,
    sortable: true,
  },
  {
    name: "Access Level",
    selector: (row) => row.accessLevel,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Actions",
    cell: () => (
      <div className="flex gap-2">
        <button
          // onClick={() => handleEdit(row.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        <button
          // onClick={() => handlePreview(row.id)}
          className="text-green-500 hover:text-green-700"
        >
          <FaEye />
        </button>
        <button
          // onClick={() => handleDelete(row.id)}
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

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredData = data.filter((item) => {
    return (
      item.fullName &&
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // const handleEdit = (id) => {
  //   toast.info(`Edit item with ID: ${id}`);
  // };

  // const handlePreview = (id) => {
  //   toast.info(`Preview item with ID: ${id}`);
  // };

  // const handleDelete = (id) => {
  //   toast.info(`Delete item with ID: ${id}`);
  // };

  if (!isMounted) {
    return null;
  }

  const OpenUserModle = () => {
    setIsOpenUser(!isOpenUser);
  };

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
                  placeholder="Search by Full Name"
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
            <div className="">
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
