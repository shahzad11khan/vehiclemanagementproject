"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddCompanymodel from "../AddCompany/AddCompanyModel";
import { GetCompany } from "../../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { API_URL_Company } from "../../Components/ApiUrl/ApiUrls";
import axios from "axios";
import UpdateCompanyModel from "../UpdateCompany/UpdateCompanyModel";

const Page = () => {
  const columns = [
    {
      name: "Company Name",
      selector: (row) => row.CompanyName,
      sortable: true,
    },
    {
      name: "Company Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Company Password",
      selector: (row) => row.confirmPassword,
      sortable: true,
    },
    {
      name: "Company Image",
      selector: (row) => row.image, // The image URL field
      cell: (row) => (
        <img
          src={row.image}
          alt="Company Image"
          style={{ width: "50px", height: "50px", borderRadius: "5px" }}
        />
      ), // Display the image
      sortable: true,
    },
    {
      name: "Company Active",
      selector: (row) => (row.isActive ? "Active" : "InActive"),
      sortable: true,
    },
    // {
    //   name: "CreatedBy",
    //   selector: (row) => row.CreatedBy,
    //   sortable: true,
    // },
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
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash className="text-red-500 hover:text-red-700" />
          </button>
        </div>
      ),
      allowOverflow: true,
      button: true,
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]); // State to hold fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenCompany, setIsOpenCompany] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {
      GetCompany().then(({ result }) => {
        console.log(result);

        setData(result); // Set the fetched data
        setFilteredData(result);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data to an empty array on error
    }
  };
  //

  // delete data from api
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Company}/${id}`);

      const data = response.data;
      console.log(data);

      if (data.success) {
        // Remove the deleted item from state
        setData((prevData) => prevData.filter((item) => item._id !== id));
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
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      // Check if item and item.title are defined before calling toLowerCase
      return (
        item &&
        item.email &&
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]); // Filter when search term or data changes

  // const toggleTitleModal = () => {
  //   setIsOpenTitle(!isOpenTitle);
  // };
  const handleEdit = (id) => {
    toast.info(`Edit item with ID: ${id}`);
    // Implement your edit logic here
    setSelectedUserId(id); // Store the selected user ID
    setIsOpenDriverUpdate(true); // Open the modal
  };

  // const handleDelete = (id) => {
  //   toast.info(`Delete item with ID: ${id}`);
  //   // Implement your delete logic here
  // };
  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenCompanyModle = () => {
    setIsOpenCompany(!isOpenCompany);
  };
  const OpenDriverUpdateModle = () => {
    setIsOpenDriverUpdate(!isOpenDriverUpdate);
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 ">
          <div className="justify-between items-center border-2 mt-3  w-[83%]">
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
                  onClick={OpenCompanyModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Company
                </button>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              title="Companies List"
              columns={columns}
              data={filteredData} // Use filtered data
              pagination
            />
          </div>
        </div>
      </div>
      <AddCompanymodel
        isOpen={isOpenCompany}
        onClose={OpenCompanyModle}
        fetchData={fetchData}
      />
      <UpdateCompanyModel
        isOpen={isOpenDriverUpdate}
        onClose={OpenDriverUpdateModle}
        fetchData={fetchData}
        existingCompanyId={selectedUserId}
      />
    </>
  );
};

export default Page;
