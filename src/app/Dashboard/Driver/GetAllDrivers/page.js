"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // Added FaEye for the preview button
import AddDriverModel from "../AddDriver/AddDriverModel";
import CustomDataTable from "../../Components/CustomDataTable";

const data = [
  {
    id: 1,
    fullName: "John Doe",
    lastName: "Doe",
    homeTel: "01234 567890",
    mobileTel: "07890 123456",
    rent: "$500",
    firm: "Alpha Corp",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    lastName: "Smith",
    homeTel: "01234 987654",
    mobileTel: "07890 654321",
    rent: "$450",
    firm: "Beta Inc.",
  },
  {
    id: 3,
    fullName: "Bob Johnson",
    lastName: "Johnson",
    homeTel: "01234 112233",
    mobileTel: "07890 778899",
    rent: "$600",
    firm: "Gamma Ltd.",
  },
  {
    id: 4,
    fullName: "Alice Brown",
    lastName: "Brown",
    homeTel: "01234 223344",
    mobileTel: "07890 889900",
    rent: "$550",
    firm: "Delta Partners",
  },
];

const columns = [
  {
    name: "Full Name",
    selector: (row) => row.fullName,
    sortable: true,
  },
  {
    name: "Last Name",
    selector: (row) => row.lastName,
    sortable: true,
  },
  {
    name: "Home Tel",
    selector: (row) => row.homeTel,
    sortable: true,
  },
  {
    name: "Mobile Tel",
    selector: (row) => row.mobileTel,
    sortable: true,
  },
  {
    name: "Rent",
    selector: (row) => row.rent,
    sortable: true,
  },
  {
    name: "Firm",
    selector: (row) => row.firm,
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
  // State for the search term
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenDriver, setIsOpenDriver] = useState(false);

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtering the data based on the search term
  const filteredData = data.filter((item) => {
    return (
      item.fullName &&
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // const handleEdit = (id) => {
  //   toast.info(`Edit driver with ID: ${id}`);
  //   // Implement your edit logic here
  // };

  // const handlePreview = (id) => {
  //   toast.info(`Preview driver with ID: ${id}`);
  //   // Implement your preview logic here
  // };

  // const handleDelete = (id) => {
  //   toast.info(`Delete driver with ID: ${id}`);
  //   // Implement your delete logic here
  // };

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenDriverModle = () => {
    setIsOpenDriver(!isOpenDriver);
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between items-center border-2 mt-3">
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

            {/* Data Table */}
            <CustomDataTable
              title="Drivers List"
              columns={columns}
              data={filteredData} // Use filtered data
              pagination
            />
          </div>
        </div>
      </div>
      <AddDriverModel isOpen={isOpenDriver} onClose={OpenDriverModle} />
    </>
  );
};

export default Page;
