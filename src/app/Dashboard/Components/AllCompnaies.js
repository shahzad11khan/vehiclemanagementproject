"use client";
import React, { useEffect, useState } from "react";
import { GetCompany } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
// import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import Card from "./Card";
import AddCompanymodel from "../Company/AddCompany/AddCompanyModel";
import { API_URL_Company } from "../Components/ApiUrl/ApiUrls";
import axios from "axios";
import UpdateCompanyModel from "../Company/UpdateCompany/UpdateCompanyModel";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import DeleteModal from "./DeleteModal";
import AdminDashBDoughnut from "../Components/AdminDashBDoughnut"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AllCompanies = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  // const [totalCompanies, setTotalCompanies] = useState(0);
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
  // const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers

  const fetchData = async () => {
    try {
      const { result } = await GetCompany();
      const activeCompanies = result.filter(
        (company) => company.isActive
      ).length;
      const inactiveCompanies = result.length - activeCompanies;

      // Set company data
      setData(result || []);
      // setTotalCompanies(result.length);

      // Prepare data for Doughnut chart
      setChartData({
        datasets: [
          {
            data: [activeCompanies, inactiveCompanies], // Dynamic data
            backgroundColor: ["#404CA0", "#27273AEB"], // Active/Inactive colors
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

  const options={
    responsive:true,
    plugins: {
        legend: {
          display: false, // Hide the default legend
        },
}}


  if (!chartData) return <p>Loading...</p>;

  return (
    <div className=" overflow-y-auto overflow-x-hidden flex flex-col gap-10 pr-4" style={{
      height:"calc(100vh - 90px)"
    }}>
      {/* <h1 className="text-2xl font-bold  mb-8 underline">
        Registered Companies
      </h1> */}
      <h1 className="text-[#313342] font-medium text-2xl py-5 underline decoration-[#AEADEB] underline-offset-8"> Registered Companies</h1>

      <AdminDashBDoughnut link={"/Dashboard/Company/AllCompanies"} title="Companies" data={chartData} option={options}/>
      {/* Doughnut Chart */}
      {/* <div className="flex flex-col p-4 rounded-md shadow-sm shadow-custom-blue w-[333px] h-[310px] item">
        <h3 className="text-lg font-semibold mb-2 flex justify-center">
          Total Companies: {totalCompanies}
        </h3>
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
      </div> */}

        

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
      <div className="w-full py-5">
        <div className="drop-shadow-custom4 ">

          {/* Add,search section */}
          
          <div className="flex justify-between w-full py-2 px-2">
            
            <div className="flex flex-wrap justify-between flex-col  sm:flex-row sm:items-center  gap-3 w-full">

            <div className="flex justify-between gap-7 items-center">
          <div className="md:flex gap-3 hidden items-center">
              <div className="font-sans font-medium text-sm">Show</div>
              <div>
                <select
                  value={itemperpage}
                  onChange={(e) =>{
                     setitemperpage(e.target.value)
                     setCurrentPage(1)
                    }}
                  className=" rounded-lg w-12  px-1  h-8 bg-[#E0E0E0]  focus:outline-none"
                >
                  <option disabled >0</option>
                  {Array.from({ length: 10 }, (_, i = 1) => i + 1).map(
                    (number) => (
                      <option key={number} value={number} >
                        {number}
                      </option>
                    )
                  )}
                </select>
              </div>
                <div className="font-sans font-medium text-sm">Entries</div>
                </div>


              <div className="flex justify-center">
                <div className="relative">
                  <img src="/search.svg" className="absolute left-3 top-2" ></img>
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E]  focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                </div>
              </div>
              </div>
              <button
                onClick={OpenCompanyModle}
                className=" w-[132px] font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2"
              >
                <img src="/plus.svg" alt="Add Company" className="" />
                Add Company
              </button>
            </div>
         
          </div>
            {/* <div className="flex items-center gap-2">
              
            </div> */}


         {/* table starts here */}
          <div className=" overflow-x-auto  custom-scrollbar">
            <table className="w-full bg-white border table-auto ">
              <thead className="font-sans font-bold text-sm text-left" >
                <tr className="   text-white bg-[#38384A]   ">
                  <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                    Company Name
                  </th>
                  <th className=" py-3 px-4 min-w-[150px] md:min-w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all  overflow-hidden">Image</th>
                  <th className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%]  text-white bg-custom-bg whitespace-normal break-all overflow-hidden">Email</th>
                  <th className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%]  text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                    Password
                  </th>
                  <th className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden ">Status</th>
                  <th className=" py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden ">Actions</th>
                </tr>
              </thead>
              <tbody className=" font-sans font-medium text-sm" >
                {currentcompany.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">{item.CompanyName}</td>
                    <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-centerr">
                      <img
                        src={item.image}
                        alt="Company"
                        className="w-8 h-8 block mx-auto rounded-lg object-cover object-center"
                      />
                    </td>
                    <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">{item.email}</td>
                    <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">{item.confirmPassword}</td>
                    <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden text-center">
                       <span className="bg-[#38384A33]  px-4 py-2 rounded-[22px] text-xs">
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                    </td>
                    <td className=" py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] whitespace-normal break-all overflow-hidden text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleEdit(item._id)}
                          // className="text-blue-500 hover:text-blue-700"
                        >
                          <img src="/edit.png" alt="edit"  className="w-6" />
                        </button>
                        <button
                          onClick={() => isopendeletemodel(item._id)}
                          // className="text-red-500 hover:text-red-700"
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

          {/* table ends here */}

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



            {/* pagination */}
            <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                  <nav>
                    <ul className="flex items-center gap-3">
                      {/* Previous Button */}
                      <li>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`h-8 px-2 border rounded-lg ${
                            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Pagination Logic */}
                      {totalPages > 1 && (
                        <>
                          {totalPages <= 3 ? (
                            // Show all pages if total pages are 3 or fewer
                            Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                              <li key={page}>
                                <button
                                  onClick={() => setCurrentPage(page)}
                                  className={`h-8 w-8 border rounded-lg ${
                                    currentPage === page ? "bg-custom-bg text-white" : "bg-white"
                                  }`}
                                >
                                  {page}
                                </button>
                              </li>
                            ))
                          ) : (
                            // Handle cases where total pages > 3
                            <>
                              {currentPage === 1 && (
                                <>
                                  <li>
                                    <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">1</button>
                                  </li>
                                  <li><span className="px-2">...</span></li>
                                  <li>
                                    <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
                                      {totalPages}
                                    </button>
                                  </li>
                                </>
                              )}
                              {currentPage > 1 && currentPage < totalPages && (
                                <>
                                  <li>
                                    <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                      {currentPage}
                                    </button>
                                  </li>
                                  <li><span className="px-2">...</span></li>
                                  <li>
                                    <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
                                      {totalPages}
                                    </button>
                                  </li>
                                </>
                              )}
                              {currentPage === totalPages && (
                                <li>
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    {totalPages}
                                  </button>
                                </li>
                              )}
                            </>
                          )}
                        </>
                      )}

                      {/* Next Button */}
                      <li>
                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`h-8 px-2 border rounded-lg ${
                            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
            {/* pagination ends here */}


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
