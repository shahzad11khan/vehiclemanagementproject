"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddEnquiryModel from "../AddEnquiry/AddEnquiryModel";
import { API_URL_Enquiry } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetEnquiry } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const columns = [
    {
      name: "Enquiry Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,

      sortable: true,
    },
    {
      name: "Enquiry Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row) => row.adminCompanyName,
      sortable: true,
    },
    {
      name: "Employee Status",
      selector: (row) => (row.isActive ? "Active" : "InActive"),
      sortable: true,
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
  // State for the search term
  const [data, setData] = useState([]); // State to hold fetched data  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenEnquiry, setIsOpenEnquiry] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  // Ensure that the component only renders once it is mounted
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName(); // Get company name from localStorage
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage); // Set the selected company name
    }
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {
      GetEnquiry().then(({ result }) => {
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
  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    console.log("Deleting ID:", id); // Log the ID to be deleted
    try {
      const response = await axios.delete(`${API_URL_Enquiry}/${id}`);
      const { data } = response; // Destructure data from response

      console.log("Response Data:", data); // Log the response data

      if (data.status === 200) {
        // If the deletion was successful, update the state
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Enquiry deleted successfully."); // Show success message
      } else {
        // If the success condition is not met
        toast.warn(data.message || "Failed to delete the Enquiry."); // Show warning message
      }
    } catch (error) {
      console.error("Error deleting Enquiry:", error); // Log the error

      // Show a user-friendly error message
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Supplier. Please try again."
      );
    }
  };

  // Filter data based on search term and selected company
  useEffect(() => {
    const filtered = data.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        selectedCompanyName &&
        item.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const usernameMatch =
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered); // Update filtered data state
  }, [searchTerm, data, selectedCompanyName]);
  // const handleEdit = (id) => {
  //   toast.info(`Edit item with ID: ${id}`);
  //   // Implement your edit logic here
  // };

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  const OpenEnquiryModle = () => {
    setIsOpenEnquiry(!isOpenEnquiry);
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
                  onClick={OpenEnquiryModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Enquiry
                </button>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              title="Enquiries List"
              columns={columns}
              data={filteredData} // Use filtered data
              pagination
            />
          </div>
        </div>
      </div>
      <AddEnquiryModel isOpen={isOpenEnquiry} onClose={OpenEnquiryModle} />
    </>
  );
};

export default Page;
