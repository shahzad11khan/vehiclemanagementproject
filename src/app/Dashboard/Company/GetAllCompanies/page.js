"use client";

import React, { useState, useEffect } from "react";
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
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenCompany, setIsOpenCompany] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const { result } = await GetCompany();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL_Company}/${id}`);
      if (data.success) {
        const updatedData = data.filter((item) => item._id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
        toast.success(data.message);
      } else {
        toast.warn(data.message);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        item?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to first page on new search
  }, [searchTerm, data]);

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenDriverUpdate(true);
  };

  const OpenCompanyModle = () => setIsOpenCompany(!isOpenCompany);
  const OpenDriverUpdateModle = () =>
    setIsOpenDriverUpdate(!isOpenDriverUpdate);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="border-2 mt-3 w-full">
            <div className="flex justify-between p-4">
              <div>
                <input
                  type="text"
                  placeholder="Search by email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div>
                <button
                  onClick={OpenCompanyModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Company
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-left text-sm">
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="py-3 px-4">{item.CompanyName}</td>
                      <td className="py-3 px-4">{item.email}</td>
                      <td className="py-3 px-4">{item.confirmPassword}</td>
                      <td className="py-3 px-4">
                        <img
                          src={item.image}
                          alt="Company"
                          className="w-12 h-12 rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
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

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-300 text-white"
                      : "bg-gray-100 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
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
