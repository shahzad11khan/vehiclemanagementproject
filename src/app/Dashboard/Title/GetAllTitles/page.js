"use client";

import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import DataTableComponent from "../../Components/CustomDataTable";
import AddTitleModel from "../AddTitle/AddTitleModel";

// Sample data
const initialData = [
  { id: 1, title: "Mr" },
  { id: 2, title: "Doctor" },
  { id: 3, title: "Miss" },
];

const columns = [
  {
    name: "Title",
    selector: (row) => row.title,
    sortable: true,
  },

  {
    name: "Actions",
    cell: () => (
      <div className="flex gap-2">
        {/* <button
          onClick={() => handleEdit(row.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button> */}
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
  const [filteredData, setFilteredData] = useState(initialData);
  const [isOpenTitle, setIsOpenTitle] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const filtered = initialData.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm]);

  // const handleEdit = (id) => {
  //   toast.info(`Edit item with ID: ${id}`);
  // };

  // const handleDelete = (id) => {
  //   toast.info(`Delete item with ID: ${id}`);
  // };

  const toggleTitleModal = () => {
    setIsOpenTitle(!isOpenTitle);
  };

  if (!isMounted) return null;

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between items-center border-2 mt-3">
            <div className="flex justify-between">
              <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-4 py-2 w-64"
              />
              <button
                onClick={toggleTitleModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Title
              </button>
            </div>
            <DataTableComponent
              title="Title List"
              columns={columns}
              data={filteredData}
            />
          </div>
        </div>
      </div>
      <AddTitleModel isOpen={isOpenTitle} onClose={toggleTitleModal} />
    </>
  );
};

export default Page;
