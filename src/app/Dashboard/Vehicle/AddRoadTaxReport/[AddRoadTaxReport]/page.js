"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddRoadTexModal from "../AddRoadTaxModal/AddRoadTaxModal";
import { API_URL_VehicleRoadTex } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName, getUserName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import BackButton from "@/app/Dashboard/Components/BackButton";
const Page = ({ params }) => {
  const router = useRouter();
  const addRoadTaxReportId = params.AddRoadTaxReport;
  console.log("ADD Road Taxt page id", addRoadTaxReportId);
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

  useEffect(() => {
    const totalPage = Math.ceil(filteredData.length / itemperpage);
    setTotalPages(totalPage);
    const startIndex = (currentPage - 1) * itemperpage;
    const endIndex = currentPage * itemperpage;
    const currentRecord = filteredData.slice(startIndex, endIndex);
    setCurrentRecords(currentRecord);
  }, [data, filteredData, itemperpage, currentPage]);

  // const recordsPerPage = 10;
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
        `${API_URL_VehicleRoadTex}/${addRoadTaxReportId}`
      );
      console.log("Road Tex Data: ", response.data.result);
      setData(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_VehicleRoadTex}/${id}`);
      if (response.data.success) {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  useEffect(() => {
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
    setselectedid(addRoadTaxReportId);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set title and report date
    doc.setFontSize(14); // Large font for title
    doc.setFont("helvetica", "bold");
    doc.text("Road Tax Records Report", 105, 10, { align: "center" });

    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(10); // Smaller font for the report date
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${reportDate}`, 14, 20);

    // Display vehicle name once at the top
    const vehicleName = filteredData[0]?.VehicleName || "Name Unavailable";
    const vehicleRegistration =
      filteredData[0]?.registrationNumber || "Registration Unavailable";
    const companyName = selectedCompanyName || "Company Unavailable";

    doc.text(`Vehicle Name: ${vehicleName}`, 14, 25);
    doc.text(`Registration Number: ${vehicleRegistration}`, 14, 30);
    doc.text(`Company Name: ${companyName}`, 14, 35);

    // Define table columns and their initial X positions
    const tableColumn = [
      "Current Date",
      "Due Date",
      "Tax Cycle",
      "Assign To",
      "Tax Status",
    ];

    let startX = 14;
    let startY = 52; // Adjust to leave space after the vehicle name
    const columnWidth = 37; // Adjusted column width to better fit the page
    const lineHeight = 5; // Height of each row
    const padding = 2; // Padding inside cells
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page

    // Add table header (Make header bold)
    doc.setFont("helvetica", "bold"); // Set the font to bold for the header
    tableColumn.forEach((column, index) => {
      const textWidth =
        (doc.getStringUnitWidth(column) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const centeredX =
        startX + index * columnWidth + (columnWidth - textWidth) / 2;
      doc.text(column, centeredX, startY);
      doc.rect(
        startX + index * columnWidth,
        startY - lineHeight,
        columnWidth,
        lineHeight
      );
    });

    // Switch back to normal font for the rows
    doc.setFont("helvetica", "normal");

    // Add table rows
    let currentY = startY + lineHeight;
    filteredData.forEach((row) => {
      // Check if the next row fits within the current page
      if (currentY + lineHeight > pageHeight - 20) {
        doc.addPage(); // Add a new page if the row won't fit
        currentY = 20; // Reset Y to start at the top of the new page
        // Re-add the header on the new page
        doc.setFont("helvetica", "bold"); // Header bold on new page
        tableColumn.forEach((column, index) => {
          const textWidth =
            (doc.getStringUnitWidth(column) * doc.getFontSize()) /
            doc.internal.scaleFactor;
          const centeredX =
            startX + index * columnWidth + (columnWidth - textWidth) / 2;
          doc.text(column, centeredX, currentY);
          doc.rect(
            startX + index * columnWidth,
            currentY - lineHeight,
            columnWidth,
            lineHeight
          );
        });
        currentY += lineHeight; // Adjust the Y after the header
        doc.setFont("helvetica", "normal"); // Switch back to normal font for rows
      }

      // Format each data cell to handle potential multi-line content
      const roadtexCurrentDate = doc.splitTextToSize(
        (() => {
          if (!row.roadtexCurrentDate) return "N/A";
          const date = new Date(row.roadtexCurrentDate);
          const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        })(),
        columnWidth - padding
      );
      const roadtexDueDate = doc.splitTextToSize(
        (() => {
          if (!row.roadtexDueDate) return "N/A"; // If roadtexDueDate is null or undefined, return "N/A"
          const date = new Date(row.roadtexDueDate);
          const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        })(),
        columnWidth - padding
      );
      const roadtexCycle = doc.splitTextToSize(
        row.roadtexCycle || "N/A",
        columnWidth - padding
      );
      const asignto = doc.splitTextToSize(
        row.asignto || "N/A",
        columnWidth - padding
      );
      const roadtexStatus = doc.splitTextToSize(
        row.roadtexStatus || "N/A",
        columnWidth - padding
      );

      const maxCellHeight =
        Math.max(
          roadtexCurrentDate.length,
          roadtexDueDate.length,
          roadtexCycle.length,
          asignto.length,
          roadtexStatus.length
        ) * lineHeight;

      // Add the data cells with borders and center the text
      doc.text(
        roadtexCurrentDate,
        startX + padding,
        currentY + maxCellHeight / 15
      );
      doc.rect(startX, currentY - lineHeight, columnWidth, maxCellHeight);

      doc.text(
        roadtexDueDate,
        startX + columnWidth + padding,
        currentY + maxCellHeight / 15
      );
      doc.rect(
        startX + columnWidth,
        currentY - lineHeight,
        columnWidth,
        maxCellHeight
      );

      doc.text(
        roadtexCycle,
        startX + 2 * columnWidth + padding,
        currentY + maxCellHeight / 15
      );
      doc.rect(
        startX + 2 * columnWidth,
        currentY - lineHeight,
        columnWidth,
        maxCellHeight
      );

      doc.text(
        asignto,
        startX + 3 * columnWidth + padding,
        currentY + maxCellHeight / 15
      );
      doc.rect(
        startX + 3 * columnWidth,
        currentY - lineHeight,
        columnWidth,
        maxCellHeight
      );

      doc.text(
        roadtexStatus,
        startX + 4 * columnWidth + padding,
        currentY + maxCellHeight / 15
      );
      doc.rect(
        startX + 4 * columnWidth,
        currentY - lineHeight,
        columnWidth,
        maxCellHeight
      );

      // Increment Y for the next row
      currentY += maxCellHeight;
    });

    //////// -----------------------------

    // Save the PDF
    doc.save("Road_Tax_Report.pdf");
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
                <span>Road Tax</span>
              </div>
            </div>
          </h1>
          
          <div className="py-5">
            <div className="drop-shadow-custom4">

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

                  <div className="flex flex-wrap gap-2 items-center">
                    <BackButton />
                    <button
                      onClick={generatePDF}
                      className={`font-sans text-sm font-semibold  px-5 h-10  border-[1px] rounded-lg border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500`}
                    >
                      Download Report
                    </button>
                    <button
                      onClick={toggleTitleModal}
                      className="w-[132px] font-sans  font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[12px] gap-2 items-center justify-center"
                    >
                      <img src="/plus.svg" alt="Add Service" />
                      Add Service
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
                        Road Tax Dates
                      </th>
                      <th className="py-3 px-4 min-w-[165px] w-[165px] md:w-[16.66%] text-start bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Road Tax Due Date
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Road Tax Cycle
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                       Road Tax Status
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
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.asignto || "N/A"}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.VehicleName}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.registrationNumber}
                        </td>
                        <td className="py-2 px-4 text-start whitespace-normal break-all overflow-hidden">
                          {row.roadtexCurrentDate
                            ? new Date(
                                row.roadtexCurrentDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 text-start whitespace-normal break-all overflow-hidden">
                          {row.roadtexDueDate
                            ? new Date(row.roadtexDueDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.roadtexCycle || "N/A"}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.roadtexStatus || "N/A"}
                        </td>
                        {/* <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.VehicleStatus ? "True" : "False"}
                        </td> */}
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
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
      <AddRoadTexModal
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
        selectedid={selectedid}
      />
    </div>
  );
};

export default Page;
