"use client";
import React, { useEffect, useState } from "react";
import { GetCompany } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import Card from "./Card";
import AddCompanymodel from "../Company/AddCompany/AddCompanyModel";
import { API_URL_Company } from "../Components/ApiUrl/ApiUrls";
import axios from "axios";
import UpdateCompanyModel from "../Company/UpdateCompany/UpdateCompanyModel";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteModal from "./DeleteModal";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AllCompanies = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenCompany, setIsOpenCompany] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);

  const isopendeletemodel = (id) => {
    setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL_Company}/${id}`);
      if (data.success) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
      } else {
        toast.warn(data.message || "Failed to delete the Company.");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

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

  const indexOfLastDriver = currentPage * itemperpage;
  const indexOfFirstDriver = indexOfLastDriver - itemperpage;
  const currentcompany = filteredData.slice(
    indexOfFirstDriver,
    indexOfLastDriver
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredData.length / itemperpage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers

  const fetchData = async () => {
    try {
      const { result } = await GetCompany();
      const activeCompanies = result.filter(
        (company) => company.isActive
      ).length;
      const inactiveCompanies = result.length - activeCompanies;

      // Set company data
      setData(result || []);
      setTotalCompanies(result.length);

      // Prepare data for Doughnut chart
      setChartData({
        datasets: [
          {
            data: [activeCompanies, inactiveCompanies], // Dynamic data
            backgroundColor: ["#4A90E2", "#D0021B"], // Active/Inactive colors
            hoverBackgroundColor: ["#4A90E2AA", "#D0021BAA"], // Hover effects
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-2">
      {/* <h1 className="text-2xl font-bold  mb-8 underline">
        Registered Companies
      </h1> */}
      <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8"> Registered Companies</h1>

      {/* Doughnut Chart */}
      <div className="flex flex-col p-4 rounded-md shadow-sm shadow-custom-blue w-[333px] h-[310px] item">
        <h3 className="text-lg font-semibold mb-2 flex justify-center">
          Total Companies: {totalCompanies}
        </h3>
        <Link href="/Dashboard/Company/AllCompanies">
          <div className="flex  items-center justify-center mt-6">
            <div className="flex flex-col w-[156.01px] h-[156.28px]">
              <Doughnut data={chartData} />
              <div className="flex  m-4 justify-between">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="text-center text-xs text-gray-700">
                                        Active
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-custom-bg"></div>
                  <h3 className="text-center text-xs text-gray-700">
                    Inactive
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Cards Section */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.map((company) => (
          <Card
            key={company._id}
            image={company.image}
            company={company.CompanyName}
            companyId={company._id}
          />
        ))}
      </div> */}
      <div className="container ">
        <div className="border-2 mt-3 w-full">
          <div className="flex justify-between p-4">
            <div className="flex justify-center text-center gap-3">
              <div className="text-custom-bg mt-2">Show</div>
              <div>
                <select
                  value={itemperpage}
                  onChange={(e) => setitemperpage(e.target.value)}
                  className="border rounded-md p-2 w-16 border-custom-bg"
                >
                  <option disabled>0</option>
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
                <div className="text-custom-bg mt-2">Entries</div>
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

            <div className="flex items-center gap-2">
              <button
                onClick={OpenCompanyModle}
                className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
              >
                <img src="/plus.png" alt="Add Company" className="w-4 h-4" />
                Add Company
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="text-white bg-custom-bg text-left text-sm">
                  <th className="py-3 px-4 text-white bg-custom-bg">
                    Company Name
                  </th>
                  <th className="py-3 px-4 text-white bg-custom-bg">Email</th>
                  <th className="py-3 px-4 text-white bg-custom-bg">
                    Password
                  </th>
                  <th className="py-3 px-4 text-white bg-custom-bg">Image</th>
                  <th className="py-3 px-4 text-white bg-custom-bg">Status</th>
                  <th className="py-3 px-4 text-white bg-custom-bg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentcompany.map((item) => (
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
                      {/* <span className="bg-gray-400 px-5 py-3 border-2 rounded-2xl">
                        {item.isActive ? "Active" : "Inactive"}
                      </span> */}

                       <span className="bg-gray-400  px-4 py-2 rounded-3xl text-sm">
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <img src="/edit.png" alt="edit"  className="w-6" />
                        </button>
                        <button
                          onClick={() => isopendeletemodel(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img src="/trash.png" alt="delete" className="w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {/* <div className="flex justify-center mt-4">
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
          </div> */}
          <div className="flex justify-center mt-4 gap-1 mb-2">
            <nav>
              <ul className="flex items-center space-x-2">
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    Previous
                  </button>
                </li>

                {pageNumbers.map((number) => (
                  <li key={number}>
                    <button
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 border rounded ${
                        currentPage === number
                          ? "bg-custom-bg text-white"
                          : "bg-white"
                      }`}
                    >
                      {number} of {totalPages}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
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
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        Id={isDeleteModalOpenId}
      />
    </div>
  );
};

export default AllCompanies;
