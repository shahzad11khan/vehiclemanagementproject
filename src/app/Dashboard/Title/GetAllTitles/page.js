"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import DataTableComponent from "../../Components/CustomDataTable";
import AddTitleModel from "../AddTitle/AddTitleModel";
import { GetTitle } from "../../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { API_URL_Title } from "../../Components/ApiUrl/ApiUrls";
import axios from "axios";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]); // State to hold fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenTitle, setIsOpenTitle] = useState(false);

  //

  // Sample data (can be removed once API data is integrated)
  const columns = [
    {
      name: "Title",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
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
  //
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {
      GetTitle().then(({ result }) => {
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
      const response = await axios.delete(`${API_URL_Title}/${id}`);

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
        item.name &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]); // Filter when search term or data changes

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
      <AddTitleModel
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
