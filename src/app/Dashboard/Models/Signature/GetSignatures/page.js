"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddSignatureModel from "../AddSignature/AddSignatureModel";

const data = [
  { id: 1, title: "Conan the Barbarian", year: "1982" },
  { id: 2, title: "Terminator", year: "1984" },
  { id: 3, title: "Commando", year: "1985" },
  { id: 4, title: "Predator", year: "1987" },
];

const columns = [
  {
    name: "Title",
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: "Year",
    selector: (row) => row.year,
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
  // State for the search term
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenSignature, setIsOpenSignature] = useState(false);

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtering the data based on the search term
  const filteredData = data.filter((item) => {
    return (
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  // const handleEdit = (id) => {
  //   toast.info(`Edit item with ID: ${id}`);
  //   // Implement your edit logic here
  // };

  // const handleDelete = (id) => {
  //   toast.info(`Delete item with ID: ${id}`);
  //   // Implement your delete logic here
  // };
  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenSignatureModle = () => {
    setIsOpenSignature(!isOpenSignature);
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
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64" // Tailwind CSS classes for input
                />
              </div>
              {/* Add User Button */}
              <div className="justify-end">
                <button
                  onClick={OpenSignatureModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Signature
                </button>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              title="Signatures List"
              columns={columns}
              data={filteredData} // Use filtered data
              pagination
            />
          </div>
        </div>
      </div>
      <AddSignatureModel
        isOpen={isOpenSignature}
        onClose={OpenSignatureModle}
      />
    </>
  );
};

export default Page;
