"use client";

import React, { useState, useEffect} from "react";
import { toast } from "react-toastify";
// import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddMotModal from "../AddMOTModal/AddMotModal";
import { API_URL_VehicleMOT } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName, getUserName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import BackButton from "@/app/Dashboard/Components/BackButton";

const Page = ({ params }) => {
  const router = useRouter();
  const addAddMOTReporttId = params.AddMOTReport;
  // console.log("from home page : ", addAddMOTReporttId);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenTitle, setIsOpenTitle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);
  const [selectedid, setselectedid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentRecords, setCurrentRecords] = useState([]);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);
  useEffect(() => {
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL_VehicleMOT}/${addAddMOTReporttId}`
      );
      // console.log("MOT Data: ", response.data.result);
      setData(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_VehicleMOT}/${id}`);
      if (response.data.success) {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting title:", error);
      toast.error("Failed to delete title");
    }
  };

  useEffect(() => {
    console.log("addAddMOTReporttId", addAddMOTReporttId);
    fetchData();
  }, []);

  useEffect(() => {
    const companyName = getCompanyName();
    const username = getUserName();

    const filtered = data.filter((item) => {
      // Check if the company name matches (case-insensitive)
      if (item.adminCompanyName.toLowerCase() === companyName.toLowerCase()) {
        return true;
      }
      // Check if the username matches and the company name matches
      return (
        username === item.asignto &&
        item.adminCompanyName.toLowerCase() === companyName.toLowerCase()
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data]);

  const toggleTitleModal = () => {
    setIsOpenTitle((prev) => !prev);
    setselectedid(addAddMOTReporttId);
  };

  useEffect(() => {
    const totalPage = Math.ceil(filteredData.length / itemperpage);
    setTotalPages(totalPage);
    const startIndex = (currentPage - 1) * itemperpage;
    const endIndex = currentPage * itemperpage;
    const currentRecord = filteredData.slice(startIndex, endIndex);
    setCurrentRecords(currentRecord);
  }, [data, filteredData, itemperpage, currentPage]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set title and report date
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("MOT Records Report", 105, 10, { align: "center" });

    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${reportDate}`, 14, 20);

    // Display vehicle details
    const vehicleName = filteredData[0].VehicleName || "Name Unavailable";
    const vehicleRegistration =
      filteredData[0].registrationNumber || "Registration Unavailable";
    doc.text(`Vehicle Name: ${vehicleName}`, 14, 30);
    doc.text(`Registration Number: ${vehicleRegistration}`, 14, 35);
    doc.text(`Company Name: ${selectedCompanyName}`, 14, 40);

    // Define table columns and widths
    const tableColumn = [
      "MOT Dates",
      "MOT Cycle",
      "Next MOT Date",
      "MOT Status",
      "MOT Assign",
    ];
    const columnWidths = [30, 30, 30, 30, 60]; // Last column is double width

    let startX = 14;
    let startY = 50;
    const lineHeight = 8;
    const pageHeight = doc.internal.pageSize.height;

    // Add table header
    doc.setFont("helvetica", "bold");
    tableColumn.forEach((column, index) => {
      doc.text(
        column,
        startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
        startY + lineHeight / 2,
        { align: "left" }
      );
      doc.rect(
        startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        startY,
        columnWidths[index],
        lineHeight
      );
    });

    // Add table rows
    let currentY = startY + lineHeight;
    doc.setFont("helvetica", "normal");
    filteredData.forEach((row) => {
      if (currentY + lineHeight > pageHeight - 20) {
        doc.addPage();
        currentY = 20;

        // Re-add the header on the new page
        doc.setFont("helvetica", "bold");
        tableColumn.forEach((column, index) => {
          doc.text(
            column,
            startX +
              columnWidths.slice(0, index).reduce((a, b) => a + b, 0) +
              2,
            currentY + lineHeight / 2,
            { align: "left" }
          );
          doc.rect(
            startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
            currentY,
            columnWidths[index],
            lineHeight
          );
        });
        currentY += lineHeight;
      }

      // Add data cells
      const data = [
        new Date(row.motCurrentDate).toLocaleDateString() || "N/A",
        row.motCycle || "N/A",
        new Date(row.motDueDate).toLocaleDateString() || "N/A",
        row.motStatus || "N/A",
        row.asignto || "N/A",
      ];

      data.forEach((cell, index) => {
        doc.text(
          cell,
          startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
          currentY + lineHeight / 2,
          { align: "left" }
        );
        doc.rect(
          startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          currentY,
          columnWidths[index],
          lineHeight
        );
      });

      currentY += lineHeight;
    });

    // Save the PDF
    doc.save("MOT_Records_Report.pdf");
  };

  return (
    <div className="h-[100vh] overflow-hidden">
      <Header className="min-w-full" />
      <div className="flex gap-4 w-full">
        <Sidebar />
        <div
          className="w-[80%] xl:w-[85%] h-screen flex flex-col justify-start overflow-y-auto pr-4"
          style={{
            height: "calc(100vh - 90px)",
          }}
        >
          <h1 className="text-[#313342] font-medium text-2xl py-5 pb-8  flex gap-2 items-center">
            <div className="myborder flex gap-3 border-2 border-t-0 border-l-0 border-r-0">
              <span className="opacity-65">Vehicle</span>
              <div className="flex items-center gap-3 myborder2">
                <span>
                  <img
                    src="/setting_arrow.svg"
                    className="w-2 h-4 object-cover object-center  "
                  ></img>
                </span>
                <span>Car MOT</span>
              </div>
            </div>
          </h1>
          <div className="py-5">
            <div className="drop-shadow-custom4">
              {/* top */}
              <div className="flex justify-between w-full py-2 px-2">
                <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                  <div className="flex  gap-7 items-center">
                    {/* Entries Selection */}
                    <div className="md:flex gap-3 hidden items-center">
                      <div className="font-sans font-medium text-sm">Show</div>
                      <div>
                        <select
                          value={itemperpage}
                          onChange={(e) => {
                            setitemperpage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="rounded-lg w-12 px-1 h-8 bg-[#E0E0E0] focus:outline-none"
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
                      <div className="font-sans font-medium text-sm">
                        Entries
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src="/search.svg"
                          className="absolute left-3 top-2"
                          alt="Search Icon"
                        />
                        <input
                          type="text"
                          placeholder="Search by Vehicle"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <BackButton />
                    <button
                      onClick={generatePDF}
                      className={`font-sans text-sm font-semibold  px-5 h-10  border-[1px] rounded-lg border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500`}
                    >
                      {/* <img src="/repor.svg" alt="Generate Report" /> */}
                      Download Report
                    </button>
                    <button
                      onClick={toggleTitleModal}
                      className="w-[132px] font-sans  font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[12px] gap-2 items-center justify-center"
                    >
                      <img src="/plus.svg" alt="Add MOT" />
                      Add MOT
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full bg-white border table-auto">
                  <thead className="font-sans font-bold text-sm text-left bg-[#38384A] text-white">
                    <tr>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Assigned To
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Vehicle Name
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Registration No
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        MOT Dates
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        MOT Cycle
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Next MOT Date
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        MOT Status
                      </th>
                      {/* <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Vehicle Status
                      </th> */}
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans font-medium text-sm">
                    {currentRecords.map((row) => (
                      <tr key={row._id} className="border-b hover:bg-gray-100">
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.asignto || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.VehicleName}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.registrationNumber}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start whitespace-normal break-all overflow-hidden">
                          {(() => {
                            const date = new Date(row.motCurrentDate);
                            return `${String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            )}/${String(date.getDate()).padStart(
                              2,
                              "0"
                            )}/${date.getFullYear()}`;
                          })() || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start whitespace-normal break-all overflow-hidden">
                          {row.motCycle || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start whitespace-normal break-all overflow-hidden">
                          {(() => {
                            const date = new Date(row.motDueDate);
                            return `${String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            )}/${String(date.getDate()).padStart(
                              2,
                              "0"
                            )}/${date.getFullYear()}`;
                          })() || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.motStatus || "N/A"}
                        </td>
                        {/* <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.VehicleStatus ? "True" : "False"}
                        </td> */}
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <img
                              src="/trash.png"
                              alt="delete"
                              className="w-6"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                <nav>
                  <ul className="flex items-center gap-3">
                    {/* Previous Button */}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`h-8 px-2 border rounded-lg ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-white"
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
                          Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                          ).map((page) => (
                            <li key={page}>
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 border rounded-lg ${
                                  currentPage === page
                                    ? "bg-custom-bg text-white"
                                    : "bg-white"
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
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    1
                                  </button>
                                </li>
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
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
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
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
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`h-8 px-2 border rounded-lg ${
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
              {/* pagination ends here  */}
            </div>
          </div>
        </div>
      </div>
      <AddMotModal
        isOpen={isOpenTitle}
        onClose={() => setIsOpenTitle(false)}
        selectedid={selectedid}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Page;
