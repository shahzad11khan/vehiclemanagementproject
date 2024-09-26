"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AddVehicleModel from "../AddVehicle/AddVehicleModel";

// Mock data with updated fields
const data = [
  {
    id: 1,
    vehicleType: "Sedan",
    model: "Toyota Camry",
    taxiPlateNumber: "TX1234",
    registration: "ABC123",
    driver: "John Doe",
    active: true,
  },
  {
    id: 2,
    vehicleType: "SUV",
    model: "Honda CRV",
    taxiPlateNumber: "TX5678",
    registration: "DEF567",
    driver: "Jane Smith",
    active: false,
  },
  {
    id: 3,
    vehicleType: "Van",
    model: "Ford Transit",
    taxiPlateNumber: "TX4321",
    registration: "GHI890",
    driver: "Bob Johnson",
    active: true,
  },
];

// Updated columns with the required fields
const columns = [
  {
    name: "Vehicle Type",
    selector: (row) => row.vehicleType,
    sortable: true,
  },
  {
    name: "Model",
    selector: (row) => row.model,
    sortable: true,
  },
  {
    name: "Taxi Plate Number",
    selector: (row) => row.taxiPlateNumber,
    sortable: true,
  },
  {
    name: "Registration",
    selector: (row) => row.registration,
    sortable: true,
  },
  {
    name: "Driver",
    selector: (row) => row.driver,
    sortable: true,
  },
  {
    name: "Active",
    selector: (row) => (row.active ? "Yes" : "No"),
    sortable: true,
  },
  {
    name: "Actions",
    cell: () => (
      <div className="flex gap-2">
        {/* Preview button */}
        <button
          // onClick={() => handlePreview(row.id)}
          className="text-green-500 hover:text-green-700"
        >
          <FaEye />
        </button>
        {/* Edit button */}
        <button
          // onClick={() => handleEdit(row.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        {/* Delete button */}
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
  const [isOpenVehicle, setIsOpenVehicle] = useState(false);

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtering the data based on the search term
  const filteredData = data.filter((item) => {
    return (
      item.model && item.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // const handleEdit = (id) => {
  //   toast.info(`Edit vehicle with ID: ${id}`);
  //   // Implement your edit logic here
  // };

  // const handleDelete = (id) => {
  //   toast.info(`Delete vehicle with ID: ${id}`);
  //   // Implement your delete logic here
  // };

  // const handlePreview = (id) => {
  //   toast.info(`Preview vehicle with ID: ${id}`);
  //   // Implement your preview logic here
  // };

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
      <AddVehicleModel isOpen={isOpenVehicle} onClose={OpenVehicleModle} />
    </>
  );
};

export default Page;
